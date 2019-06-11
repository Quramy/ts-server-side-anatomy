import * as ts from "typescript/lib/tsserverlibrary";

import { Location } from "../types";
import { ScriptInfo } from "./script-info";
import { TS_LIB_FILE_PREFIX } from "../consts";
import { getTypeScriptDefinitionText } from "./lib-defitions";
import { rootLogger } from "../logger";

const logger = rootLogger.getCategory("LSHost");

export class Project implements ts.LanguageServiceHost {
  fileMap: Map<string, ScriptInfo>;

  constructor() {
    this.fileMap = new Map();
  }

  getCompilationSettings(): ts.CompilerOptions {
    return ts.getDefaultCompilerOptions();
  }

  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return TS_LIB_FILE_PREFIX + "/" + ts.getDefaultLibFileName(options);
  }

  getCurrentDirectory(): string {
    return "/";
  }

  getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined {
    const scriptInfo = this.getOrCreateScriptInfo(fileName);
    if (scriptInfo) {
      return scriptInfo.getSnapshot();
    }
    return undefined;
  }

  getScriptVersion(fileName: string): string {
    return this.getScriptInfoInternal(fileName).getVersion();
  }

  getScriptFileNames(): string[] {
    return [...this.fileMap.keys()];
  }

  loadContent(fileName: string, content: string) {
    this.createScriptInfoFromInitalContent(fileName, content);
  }

  getScriptInfo(fileName: string) {
    return this.getOrCreateScriptInfo(fileName);
  }

  getExistingScriptInfo(fileName: string) {
    return this.getScriptInfoInternal(fileName);
  }

  private getOrCreateScriptInfo(fileName: string) {
    const f = this.fileMap.get(fileName);
    if (f) return f;

    // lib.d.ts case
    if (fileName.startsWith(TS_LIB_FILE_PREFIX)) {
      const content = getTypeScriptDefinitionText(fileName);
      return this.createScriptInfoFromInitalContent(fileName, content);
    }

    return this.createScriptInfoFromInitalContent(fileName, "");
  }

  private createScriptInfoFromInitalContent(fileName: string, content: string) {
    const info = new ScriptInfo({ content });
    logger.log("open", { fileName })
    this.fileMap.set(fileName, info);

    return info;
  }

  private getScriptInfoInternal(fileName: string) {
    const f = this.fileMap.get(fileName);
    if (!f) {
      throw new Error("file not found " + fileName);
    }
    return f;
  }
}
