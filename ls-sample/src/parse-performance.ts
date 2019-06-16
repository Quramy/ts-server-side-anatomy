import * as ts from "typescript";

const insertText = "\ndeclare namespace hoge { export function fooobar(): void; }"

const rangeItems = (n: number) => {
  const arr = [];
  for(let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
};

function checkPerf(lines: number) {
  const originalSourceText = `declare namespace fuga {
${rangeItems(lines - 3).map((_, i) => "  function fn" + i + "(): number;").join("\n")}
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

  console.log("==================================")
  console.log(`originalSourceText lines: ${originalSourceText.split("\n").length}`);
  console.log(`originalSourceText length: ${originalSourceText.length}`);
  console.log(`insertText length: ${insertText.length}`);
  console.log(`elapsed time with incremental parsing: ${e1 - s1}`);
  console.log(`elapsed time with non-incremental parsing: ${e2 - s2}`);
  console.log("");
}

checkPerf(100);
checkPerf(500);
checkPerf(1000);
checkPerf(5000);
checkPerf(10000);
