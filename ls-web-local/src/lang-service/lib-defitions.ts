import { TS_LIB_FILE_PREFIX } from "../consts";

const rawFileMap = new Map<string, string>();

rawFileMap.set("/lib.esnext.d.ts", require("typescript/lib/lib.esnext.d.ts"));
rawFileMap.set("/lib.esnext.full.d.ts", require("typescript/lib/lib.esnext.full.d.ts"));

export function getTypeScriptDefinitionText(name: string) {
  if (!name.startsWith(TS_LIB_FILE_PREFIX)) {
    throw new Error("invalid prefix: " + name);
  }
  const libname = name.slice(TS_LIB_FILE_PREFIX.length);
  const content = rawFileMap.get(libname);
  if (!content) {
    throw new Error("not included lib.d.ts: " + libname);
  }
  return content;
};
