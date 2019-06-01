import { Observable } from "rxjs";
import * as ts from "typescript/lib/tsserverlibrary";
import { TS_LIB_FILE_PREFIX } from "../consts";
import { getTypeScriptDefinitionText } from "./lib-defitions";
import { ScriptVersionCache, createSvcFromString } from "./svc";
import { Location } from "../types";

type CreateScriptInfoOptions = {
  content: string,
};

class ScriptInfo {

  private initalContent: string;
  private snapshot: ts.IScriptSnapshot;
  private svc?: ScriptVersionCache;
  private svcVersion = 0;

  constructor(options: CreateScriptInfoOptions) {
    this.initalContent = options.content;
    this.snapshot = ts.ScriptSnapshot.fromString(options.content);
  }

  getSnapshot(): ts.IScriptSnapshot {
    if (!this.svc) {
      return this.snapshot;
    } else {
      return this.svc.getSnapshot();
    }
  }

  getVersion() {
    if (!this.svc) {
      return "0";
    } else {
      return `SVC-${this.svcVersion}`;
    }
  }

  edit(start: Location, end: Location, newText: string) {
    if (!this.svc) {
      this.svc = createSvcFromString(this.initalContent);
    }
    const p1 = this.svc.lineOffsetToPosition(start.line, start.offset);
    const p2 = this.svc.lineOffsetToPosition(end.line, end.offset);
    this.svc.edit(p1, p2 - p1, newText);

    const l = this.svc.getSnapshot().getLength();
    const t = this.svc.getSnapshot().getText(0, l);
    console.log(l, t);

    this.svcVersion++;
  }

}

class Project implements ts.LanguageServiceHost {
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

export type CreateSessionOption = {
  initialContents: {fileName: string, content: string}[],
};

export type ChangeArgs = {
  fileName: string,
  newText: string,
  start: Location,
  end: Location,
};

export class Session {

  project: Project;
  service: ts.LanguageService;

  constructor(option: CreateSessionOption) {
    this.project = new Project();
    this.service = ts.createLanguageService(this.project);
    option.initialContents.forEach(initialContent => {
      this.project.loadContent(initialContent.fileName, initialContent.content);
    });
  }

  change({fileName, start, end, newText }: ChangeArgs) {
    this.project.getScriptInfo(fileName).edit(start, end, newText);
  }

}
