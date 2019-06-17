import { Subject, BehaviorSubject, merge, Subscription } from "rxjs";
import {
  map,
  debounceTime,
} from "rxjs/operators";
import { LanguageServiceSession } from "../lang-service/lang-service";
import { Ace } from "ace-builds";
import { pos2loc, loc2pos } from "../util";

export type CreateLsClientOptions = {
  debounceTime: number,
  useComplete: boolean,
  initialContents: { fileName: string, content: string }[],
}

export class LsClient {

  public readonly languageServiceSession: LanguageServiceSession;
  public readonly useComplete: boolean;

  private inital$: Subject<string>;
  private change$: Subject<{ fileName: string, delta: Ace.Delta }>;
  private subscriptions = new Subscription();

  constructor(private options: CreateLsClientOptions) {
    this.languageServiceSession = new LanguageServiceSession(options);
    this.change$ = new Subject();
    this.observeChange();
    if (options.initialContents.length) {
      this.inital$ = new BehaviorSubject(options.initialContents[0].fileName);
    } else {
      this.inital$ = new Subject();
    }
    this.useComplete = options.useComplete;
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
    return merge(this.inital$, this.change$.pipe(debounceTime(this.options.debounceTime))).pipe(map(() => this.languageServiceSession.getErrors({ fileName })),
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
