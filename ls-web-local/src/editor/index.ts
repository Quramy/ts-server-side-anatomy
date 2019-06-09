import ace, { Ace } from "ace-builds";
import "ace-builds/webpack-resolver"; // tell theme, syntax highlight module url to webpack

import { Observable, Subject, BehaviorSubject, merge, Subscription } from "rxjs";
import {
  map,
  debounceTime,
} from "rxjs/operators";

import { Location } from "../types";
import { LanguageServiceSession } from "../lang-service/lang-service";
import { pos2loc, loc2pos } from "../util";

const langTools = require("ace-builds/src-noconflict/ext-language_tools");

function createCompleter(langServiceSession: LanguageServiceSession) {
  return {
    identifierRegexps: [/[\d\w]+/],
  	getCompletions: function(editor: Ace.Editor, session: Ace.EditSession, pos: any, prefix: string, callback: Function) {
      const entries = langServiceSession.getCompletions({ fileName: "/main.ts", ...pos2loc(pos), prefix });
  		callback(null, entries.map(({ name }) => ({ value: name })));
  	},
  };
}

export type CreateLspClientOptions = {
  initialContents: { fileName: string, content: string }[],
}

export class LspClient {

  public readonly languageServiceSession: LanguageServiceSession;

  private inital$: Subject<string>;
  private change$: Subject<{ fileName: string, delta: Ace.Delta }>;
  private subscriptions = new Subscription();

  constructor(options: CreateLspClientOptions) {
    this.languageServiceSession = new LanguageServiceSession(options);
    this.change$ = new Subject();
    this.observeChange();
    if (options.initialContents.length) {
      this.inital$ = new BehaviorSubject(options.initialContents[0].fileName);
    } else {
      this.inital$ = new Subject();
    }
  }

  private observeChange() {
    const x = this.change$.pipe(map(( { fileName, delta }) => ({
      fileName,
      start: pos2loc(delta.start),
      end: delta.action === "insert" ?  pos2loc(delta.start) : pos2loc(delta.end),
      newText: delta.action === "insert" ? delta.lines.join("\n") : "",
    })))
    .subscribe(changeArg => this.languageServiceSession.change(changeArg));
    this.subscriptions.add(x);
  }

  nextChange(fileName: string, delta: Ace.Delta) {
    this.change$.next({ fileName, delta });
  }

  getErrors$(fileName: string) {
    return merge(this.inital$, this.change$.pipe(debounceTime(100))).pipe(map(() => this.languageServiceSession.getErrors({ fileName })),
      map(errors => {
        const syntaxErrors = errors.syntacticDiagnostics.map(d => ({
          fileName,
          code: d.code,
          key: `${fileName}${d.start.line}${d.start.offset}${d.code}`,
          type: "error",
          text: d.messageText as string,
          ...loc2pos(d.start),
        }))
        const semanticErrors = errors.semanticDeagnostics.map(d => ({
          fileName,
          code: d.code,
          key: `${fileName}${d.start.line}${d.start.offset}${d.code}`,
          type: "error",
          text: d.messageText as string,
          ...loc2pos(d.start),
        }))
        return [...syntaxErrors, ...semanticErrors]
      }),
    )
  }
}

export function setupEditor(element: HTMLElement | null, lspClient: LspClient) {
  if (!element) return;

  const editor = ace.edit(element);
  editor.setOptions({
    fontSize: "22px",
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: true,
  });
  const editorSession = editor.getSession();

  editor.setTheme("ace/theme/monokai");
  editorSession.setMode("ace/mode/typescript");
  editorSession.setTabSize(2);

  const inital$ = new Subject<string>();
  const initalContent = lspClient.languageServiceSession.getContentFromFileName("/main.ts");
  editor.getSession().getDocument().insert({ column: 0, row: 0 }, initalContent);
  
  const changeSource$ = new Subject<Ace.Delta>();
  editor.on("change", delta => lspClient.nextChange("/main.ts", delta));

  lspClient.getErrors$("/main.ts").subscribe(errors => editorSession.setAnnotations(errors));

  const completer = createCompleter(lspClient.languageServiceSession);
  langTools.addCompleter(completer);

  return editor;
}

