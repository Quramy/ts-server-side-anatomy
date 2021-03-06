import ace, { Ace } from "ace-builds";
import "ace-builds/webpack-resolver"; // tell theme, syntax highlight module url to webpack
import { Observable, Subject } from "rxjs";
import {
  map,
  debounceTime,
} from "rxjs/operators";

import { rootLogger } from "../logger";
import { LanguageServiceSession } from "../lang-service/lang-service";
import { LsClient } from "../lang-service-client";
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

export function setupEditor(element: HTMLElement | null, lsClient: LsClient) {
  if (!element) return;

  const editor = ace.edit(element);
  editor.setOptions({
    fontSize: "1.3rem",
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: lsClient.useComplete,
  });
  const editorSession = editor.getSession();

  editor.setTheme("ace/theme/monokai");
  editorSession.setMode("ace/mode/typescript");
  editorSession.setTabSize(2);

  const inital$ = new Subject<string>();
  const initalContent = lsClient.languageServiceSession.getContentFromFileName("/main.ts");
  editor.getSession().getDocument().insert({ column: 0, row: 0 }, initalContent);
  
  const changeSource$ = new Subject<Ace.Delta>();
  const logger = rootLogger.getCategory("ace");
  editor.on("change", delta => {
    logger.log("sendChange", delta);
    lsClient.nextChange("/main.ts", delta);
  });

  lsClient.getErrors$("/main.ts").subscribe(errors => {
    if (errors.length) {
      logger.log("rcvError", errors);
    } else {
      logger.log("clearError");
    }
    editorSession.setAnnotations(errors);
  });

  if (lsClient.useComplete) {
    const completer = createCompleter(lsClient.languageServiceSession);
    langTools.addCompleter(completer);
  }

  return editor;
}

