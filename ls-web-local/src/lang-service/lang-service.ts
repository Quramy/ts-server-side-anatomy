import * as ts from "typescript/lib/tsserverlibrary";
import { Location } from "../types";
import { Project } from "./project";
import { rootLogger } from "../logger";

export type CreateLanguageServiceSessionOption = {
  initialContents: {fileName: string, content: string}[],
};

export type ChangeArgs = {
  fileName: string,
  newText: string,
  start: Location,
  end: Location,
};

export type GetErrorsArgs = {
  fileName: string,
};

export type GetCompletionsArgs = {
  fileName: string,
  line: number,
  offset: number,
  prefix: string,
}

const lsLogger = rootLogger.getCategory("LS");

export class LanguageServiceSession {

  project: Project;
  langService: ts.LanguageService;

  constructor(option: CreateLanguageServiceSessionOption) {
    this.project = new Project();
    this.langService = new Proxy(ts.createLanguageService(this.project), {
      get: (target: ts.LanguageService, name: keyof ts.LanguageService) => {
        if (!["getCompletionsAtPosition", "getSyntacticDiagnostics", "getSemanticDiagnostics"].includes(name)) {
          return target[name];
        }
        return function() {
          lsLogger.log(`start_${name}`, [...arguments]);
          const res = (target[name] as Function).apply(target, arguments);
          lsLogger.log(`end_${name}`);
          return res;
        };
      },
    });
    option.initialContents.forEach(initialContent => {
      this.project.loadContent(initialContent.fileName, initialContent.content);
    });
  }

  getContentFromFileName(fileName: string) {
    const snapshot = this.project.getScriptInfo(fileName).getSnapshot();
    const length = snapshot.getLength();
    return snapshot.getText(0, length);
  }

  change({fileName, start, end, newText }: ChangeArgs) {
    this.project.getExistingScriptInfo(fileName).edit(start, end, newText);
  }

  getCompletions({ fileName, prefix, line, offset }: GetCompletionsArgs) {
    const scriptInfo = this.project.getExistingScriptInfo(fileName);
    const pos = scriptInfo.location2number({ line, offset });
    const result = this.langService.getCompletionsAtPosition(fileName, pos, undefined);
    if (!result) return [];
    return result.entries.filter(e => e.name.startsWith(prefix));
  }

  getErrors({ fileName }: GetErrorsArgs) {
    const scriptInfo = this.project.getExistingScriptInfo(fileName);
    const syntacticDiagnostics = this.langService.getSyntacticDiagnostics(fileName).map(d => ({
      code: d.code,
      messageText: d.messageText,
      start: scriptInfo.number2location(d.start),
      end: scriptInfo.number2location(d.start + d.length),
    }));
    const semanticDeagnostics = this.langService.getSemanticDiagnostics(fileName).map(d => ({
      code: d.code,
      messageText: d.messageText,
      start: d.start ? scriptInfo.number2location(d.start) : { line: 1, offset: 1 },
      end:  d.start && d.length ? scriptInfo.number2location(d.start + d.length) : { line: 1, offset: 1 },
    }));
    return {
      syntacticDiagnostics,
      semanticDeagnostics,
    };
  }

}
