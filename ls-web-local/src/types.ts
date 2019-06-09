import { Ace } from "ace-builds";
import { Observable } from "rxjs";

export type Location = {
  line: number,
  offset: number,
};

export type StreamType<S> = S extends Observable<infer T> ? T : never;
