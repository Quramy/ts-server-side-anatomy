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

const langTools = require("ace-builds/src-noconflict/ext-language_tools");

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

function createCompleter(langServiceSession: LanguageServiceSession) {
  return {
    identifierRegexps: [/[\d\w]+/],
  	getCompletions: function(editor: Ace.Editor, session: Ace.EditSession, pos: any, prefix: string, callback: Function) {
      const entries = langServiceSession.getCompletions({ fileName: "/main.ts", ...pos2loc(pos), prefix });
  		callback(null, entries.map(({ name }) => ({ value: name })));
  	},
  };
}

export function setupEditor(element: HTMLElement) {

  const editor = ace.edit(element);
  editor.setOptions({
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: true,
  });
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

  const completer = createCompleter(langServiceSession);
  langTools.addCompleter(completer);

  return editor;
}

