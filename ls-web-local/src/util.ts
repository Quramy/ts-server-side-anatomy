import { Location } from "./types";

export function pos2loc(input: { row: number, column: number }) {
  return {
    line: input.row + 1,
    offset: input.column + 1,
  } as Location;
}

export function loc2pos(input: Location) {
  return {
    row: input.line - 1,
    column: input.offset - 1,
  };
}
