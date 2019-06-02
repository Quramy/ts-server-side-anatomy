import ace, { Ace } from "ace-builds";
import "ace-builds/webpack-resolver"; // tell theme, syntax highlight module url to webpack

import { Subject, merge } from "rxjs";
import {
  map,
  debounceTime,
} from "rxjs/operators";

import { Location } from "../types";
import { LanguageServiceSession } from "../lang-service/lang-service";
import { pos2loc, loc2pos } from "../util";

function createErrorRenderer(editorSession: Ace.EditSession, langServiceSession: LanguageServiceSession) {
  return (fileName: string) => {
    const erros = langServiceSession.getErrors({ fileName });
    const syntaxErrors = erros.syntacticDiagnostics.map(d => ({
      type: "error",
      text: d.messageText as string,
      ...loc2pos(d.start),
    }))
    const semanticErrors = erros.semanticDeagnostics.map(d => ({
      type: "error",
      text: d.messageText as string,
      ...loc2pos(d.start),
    }))
    editorSession.setAnnotations([...syntaxErrors, ...semanticErrors]);
  };
}

export function setupEditor(id: string) {

  const editor = ace.edit(id);
  const editorSession = editor.getSession();

  editor.setTheme("ace/theme/monokai");
  editorSession.setMode("ace/mode/typescript");
  editorSession.setTabSize(2);
  
  const inital$ = new Subject<string>();
  const initalContent = editor.getSession().getDocument().getValue();
  
  const langServiceSession = new LanguageServiceSession({
    initialContents: [{ fileName: "/main.ts", content: initalContent }],
  });
  
  const changeSource$ = new Subject<Ace.Delta>();
  editor.on("change", delta => changeSource$.next(delta));
  
  changeSource$
  .pipe(map(delta => ({
    start: pos2loc(delta.start),
    end: delta.action === "insert" ?  pos2loc(delta.start) : pos2loc(delta.end),
    newText: delta.action === "insert" ? delta.lines.join("\n") : "",
  })))
  .subscribe(delta => langServiceSession.change({ fileName: "/main.ts", ...delta }));

  const errorRenderer = createErrorRenderer(editorSession, langServiceSession);
  merge(inital$, changeSource$.pipe(debounceTime(100), map(() => "/main.ts"))).subscribe(errorRenderer);
  inital$.next("/main.ts");

  return editor;
}

