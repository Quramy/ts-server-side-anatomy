import * as ts from "typescript/lib/tsserverlibrary";

import { ScriptVersionCache, createSvcFromString } from "./svc";
import { Location } from "../types";
import { rootLogger } from "../logger";

export type CreateScriptInfoOptions = {
  content: string,
};

const logger = rootLogger.getCategory("SInfo");

export class ScriptInfo {

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
      // console.log(this.svc);
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
      logger.log("upgradeToSVC");
      this.svc = createSvcFromString(this.initalContent);
    }
    const p1 = this.svc.lineOffsetToPosition(start.line, start.offset);
    const p2 = this.svc.lineOffsetToPosition(end.line, end.offset);
    this.svc.edit(p1, p2 - p1, newText);

    try {
      // Debug
      const svc: any = this.svc;
      const { root } = svc.versions[svc.currentVersion].index;
      const obj = JSON.parse(JSON.stringify(root));
      logger.log("changed", obj);
    } catch (e) {
      console.log(e);
    }

    this.svcVersion++;
  }

  number2location(pos: number) {
    if (!this.svc) {
      let l = 0, c = 0;
      for (let i = 0; i < this.initalContent.length && i < pos; i++) {
        const cc = this.initalContent[i];
        if (cc === "\n") {
          c = 0;
          l++;
        } else {
          c++;
        }
      }
      return { line: l + 1, offset: c + 1 };
    }
    return this.svc.positionToLineOffset(pos);
  }

  location2number(pos: Location) {
    if (!this.svc) {
      let il = 0,  ic = 0;
      for (let i = 0; i < this.initalContent.length; i++) {
        const cc = this.initalContent[i];
        if (il === pos.line - 1) {
          if (ic === pos.offset - 1) {
            return i;
          }
        }
        if (cc === "\n") {
          ic = 0;
          il++;
        } else {
          ic++;
        }
      }
      return this.initalContent.length;
    }
    return this.svc.lineOffsetToPosition(pos.line, pos.offset);
  }

}
