import { Ace } from "ace-builds";
import { Observable } from "rxjs";

export type Location = {
  line: number,
  offset: number,
};

export type StreamType<S> = S extends Observable<infer T> ? T : never;

export type Optional<T> = {[P in keyof T]?: T[P]};

export type Configuration = {
  initialContent: string,
  debounceTime: number,
  showLogger: boolean,
};
