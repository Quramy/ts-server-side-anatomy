import { Subject } from "rxjs";
import { tap, map } from "rxjs/operators";
import ace, { Ace } from "ace-builds";

import { Location } from "../types";
import { Session } from "../lang-service/lang-service";
import { pos2loc } from "../util";

export function setupEditor(id: string) {

  const editor = ace.edit(id);
  
  const changeSource$ = new Subject<Ace.Delta>();
  
  const initalContent = editor.getSession().getDocument().getValue();
  
  const session = new Session({
    initialContents: [{ fileName: "/main.ts", content: initalContent }],
  });
  
  editor.on("change", delta => changeSource$.next(delta));
  
  changeSource$
  .pipe(
    map(delta => ({
      start: pos2loc(delta.start),
      end: delta.action === "insert" ?  pos2loc(delta.start) : pos2loc(delta.end),
      newText: delta.action === "insert" ? delta.lines.join("\n") : "",
    })),
  )
  .subscribe(delta => {
    // console.log(delta);
    session.change({ fileName: "/main.ts", ...delta });
  });

  return editor;
}

