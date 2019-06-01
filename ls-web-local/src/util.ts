import { Location } from "./types";

export function pos2loc(input: { row: number, column: number }) {
  return {
    line: input.row + 1,
    offset: input.column + 1,
  } as Location;
}
