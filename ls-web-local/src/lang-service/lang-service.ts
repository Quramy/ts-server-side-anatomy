import * as ts from "typescript/lib/tsserverlibrary";
import { Location } from "../types";
import { Project } from "./project";

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

export class LanguageServiceSession {

  project: Project;
  langService: ts.LanguageService;

  constructor(option: CreateLanguageServiceSessionOption) {
    this.project = new Project();
    this.langService = ts.createLanguageService(this.project);
    option.initialContents.forEach(initialContent => {
      this.project.loadContent(initialContent.fileName, initialContent.content);
    });
  }

  change({fileName, start, end, newText }: ChangeArgs) {
    this.project.getScriptInfo(fileName).edit(start, end, newText);
  }

  getErrors({ fileName }: GetErrorsArgs) {
    const scriptInfo = this.project.getScriptInfo(fileName);
    const syntacticDiagnostics = this.langService.getSyntacticDiagnostics(fileName).map(d => ({
      messageText: d.messageText,
      start: scriptInfo.number2location(d.start),
      end: scriptInfo.number2location(d.start + d.length),
    }));
    const semanticDeagnostics = this.langService.getSemanticDiagnostics(fileName).map(d => ({
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
