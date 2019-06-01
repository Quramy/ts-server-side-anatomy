import { TS_LIB_FILE_PREFIX } from "../consts";

const rawFileMap = new Map<string, string>();

rawFileMap.set("/lib.d.ts", require("typescript/lib/lib.d.ts").default);
rawFileMap.set("/lib.es5.d.ts", require("typescript/lib/lib.es5.d.ts").default);
rawFileMap.set("/lib.esnext.d.ts", require("typescript/lib/lib.esnext.d.ts").default);
rawFileMap.set("/lib.esnext.full.d.ts", require("typescript/lib/lib.esnext.full.d.ts").default);
rawFileMap.set("/lib.dom.d.ts", require("typescript/lib/lib.dom.d.ts").default);
rawFileMap.set("/lib.webworker.importscripts.d.ts", require("typescript/lib/lib.webworker.importscripts.d.ts").default);
rawFileMap.set("/lib.scripthost.d.ts", require("typescript/lib/lib.scripthost.d.ts").default);

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
