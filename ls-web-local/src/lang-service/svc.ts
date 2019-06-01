import * as ts from "typescript/lib/tsserverlibrary";
import { Location } from "../types";

interface AbsolutePositionAndLineText {
  absolutePosition: number;
  lineText: string | undefined;
}

export declare class ScriptVersionCache {
  private changes;
  private readonly versions;
  private minVersion;
  private currentVersion;
  private static readonly changeNumberThreshold;
  private static readonly changeLengthThreshold;
  private static readonly maxVersions;
  private versionToIndex;
  private currentVersionToIndex;
  edit(pos: number, deleteLen: number, insertedText?: string): void;
  getSnapshot(): ts.IScriptSnapshot;
  private _getSnapshot;
  getSnapshotVersion(): number;
  getAbsolutePositionAndLineText(oneBasedLine: number): AbsolutePositionAndLineText;
  lineOffsetToPosition(line: number, column: number): number;
  positionToLineOffset(position: number): Location;
  lineToTextSpan(line: number): ts.TextSpan;
  getTextChangesBetweenVersions(oldVersion: number, newVersion: number): ts.TextChangeRange | undefined;
  getLineCount(): number;
  static fromString(script: string): ScriptVersionCache;
}

export function createSvcFromString(script: string) {
  return (ts.server as any)["ScriptVersionCache"].fromString(script) as ScriptVersionCache;
}
