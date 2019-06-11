import * as ts from "typescript";
import path from "path";
import fs from "fs";

const insertText = "\ndeclare namespace hoge { export function fuga(): void; }"

const rangeItems = (n: number) => {
  const arr = [];
  for(let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
};

function main() {
  const originalSourceText = `declare namespace fuga {
${rangeItems(4000 - 3).map((_, i) => "  function fn" + i + "(): number;").join("\n")}
}
  `;

  const origSource = ts.createSourceFile("index.d.ts", originalSourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);

  const s1 = Date.now();
  let sourceFile = origSource;
  for (let i = 0; i < insertText.length; i++) {
    const pos = sourceFile.end;
    sourceFile = ts.updateSourceFile(sourceFile, sourceFile.getText() + insertText[i], { newLength: 1, span: { start: pos, length: 0 } });
  }
  const e1 = Date.now();

  const s2 = Date.now();
  for (let i = 0; i < insertText.length; i++) {
    const origSource = ts.createSourceFile("index.d.ts", originalSourceText + insertText.slice(0, i), ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  }
  const e2 = Date.now();

  console.log(`originalSourceText lines: ${originalSourceText.split("\n").length}`);
  console.log(`originalSourceText length: ${originalSourceText.length}`);
  console.log(`insertText length: ${insertText.length}`);
  console.log(`elapsed time with incremental parsing: ${e1 - s1}`);
  console.log(`elapsed time with non-incremental parsing: ${e2 - s2}`);
}

main();
