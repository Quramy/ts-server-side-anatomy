# BTW

---

# Have you written something in TypeScript? 🙋

---

# Have you used TypeScript's language service? 🙋

---

# You must have

---

# Today's theme

---

# **TypeScript editor, what's under the hood**

---

# That is ...

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D220%253A0" allowfullscreen></iframe>

[*Architectural Overview*](https://github.com/microsoft/TypeScript/wiki/Architectural-Overview#layer-overview)

---

# **1. Editor agnostic**

---

## Functions what we want for editor/IDEs

- Error checking
- Completion
- Jump to definition
- Jump to references
- etc...

---

## It's toooo tough to implement the features as each editor's plugin 😇

---

## No more [editor war](https://en.wikipedia.org/wiki/Editor_war)!

![editor_war](https://pbs.twimg.com/media/Bhfbnn3CMAA93mg.png:large)

---

## tsserver

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D222%253A2" allowfullscreen></iframe>

TypeScript's server, a.k.a. **tsserver**, gives language functions to editor/IDEs 👍

---

## Features of tsserver

* Communicates over STDIO
  * Editor/IDEs need **no JavaScript** code
* Using JSON paylod such as JSON RPC protocol

---

## Seeing is believing

```ts
function hoge(x: string) {
  console.log(x);
}
```

Let's ask to tsserver "What's type of `x` at the line: 2 / col: 15"

---

```bash
# test.sh

cat << EOF > sample.ts
function hoge(x: string) {
  console.log(x);
}
EOF

npx tsserver << EOF | tail -n 1 | jq .body
{"command":"open","arguments":{"file":"${PWD}/sample.ts"}}
{"command":"quickinfo","arguments":{"file":"${PWD}/sample.ts","line":2,"offset":15}}
EOF
```

```bash
$ sh test.sh
{
  "kind": "parameter",
  "kindModifiers": "",
  "start": {
    "line": 2,
    "offset": 15
  },
  "end": {
    "line": 2,
    "offset": 16
  },
  "displayString": "(parameter) x: string",
  "documentation": "",
  "tags": []
}
```

---

## Another, real world example

```bash
$ export TSS_LOG="-file `pwd`/tsserver.log -level verbose"
$ code .
```

---

```txt
Info 0    [3:43:45.342] Starting TS Server
Info 1    [3:43:45.342] Version: 3.5.1
Info 2    [3:43:45.342] Arguments: /Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper.app/Contents/MacOS/Code Helper /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --enableTelemetry --cancellationPipeName /var/folders/bc/t99h94ls1k9c59bcjtkx3tmr0000gn/T/vscode-typescript/tscancellation-df93638a114cbddaa780.tmp* --locale en --noGetErrOnBackgroundUpdate --validateDefaultNpmLocation
Info 3    [3:43:45.342] Platform: darwin NodeVersion: 10 CaseSensitive: false
Info 4    [3:43:45.347] Binding...
Info 5    [3:43:45.353] request:
    {"seq":0,"type":"request","command":"configure","arguments":{"hostInfo":"vscode","preferences":{"providePrefixAndSuffixTextForRename":true,"allowRenameOfImportPath":true}}}
Info 6    [3:43:45.354] Host information vscode
Info 7    [3:43:45.354] response:
    {"seq":0,"type":"response","command":"configure","request_seq":0,"success":true}
Perf 8    [3:43:45.356] 0::configure: async elapsed time (in milliseconds) 2.6602
Info 9    [3:43:45.356] request:
    {"seq":1,"type":"request","command":"compilerOptionsForInferredProjects","arguments":{"options":{"module":"commonjs","target":"es2016","jsx":"preserve","allowJs":true,"allowSyntheticDefaultImports":true,"allowNonTsExtensions":true}}}
Info 10   [3:43:45.359] Scheduled: *ensureProjectForOpenFiles*
Perf 11   [3:43:45.359] 1::compilerOptionsForInferredProjects: elapsed time (in milliseconds) 2.6574
Info 12   [3:43:45.359] response:
    {"seq":0,"type":"response","command":"compilerOptionsForInferredProjects","request_seq":1,"success":true,"body":true}
Info 13   [3:43:45.359] request:
    {"seq":2,"type":"request","command":"updateOpen","arguments":{"openFiles":[{"file":"/tsjp-resources/sample-projects/symple/main.ts","fileContent":"const b = 1;\nconst a = b;","scriptKindName":"TS","projectRootPath":"/tsjp-resources/sample-projects/symple"}]}}
Info 14   [3:43:45.362] Search path: /tsjp-resources/sample-projects/symple
Info 15   [3:43:45.362] ConfigFilePresence:: Current Watches: :: File: /tsjp-resources/sample-projects/symple/tsconfig.json Currently impacted open files: RootsOfInferredProjects:  OtherOpenFiles: /tsjp-resources/sample-projects/symple/main.ts Status: File added to open files impacted by this config file
Info 16   [3:43:45.362] For info: /tsjp-resources/sample-projects/symple/main.ts :: Config file name: /tsjp-resources/sample-projects/symple/tsconfig.json
Info 17   [3:43:45.363] Opened configuration file /tsjp-resources/sample-projects/symple/tsconfig.json
Info 18   [3:43:45.365] FileWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/symple/tsconfig.json 2000 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Config file
Info 19   [3:43:45.366] event:
    {"seq":0,"type":"event","event":"projectLoadingStart","body":{"projectName":"/tsjp-resources/sample-projects/symple/tsconfig.json","reason":"Creating possible configured project for /tsjp-resources/sample-projects/symple/main.ts to open"}}
Info 20   [3:43:45.383] DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Wild card directory
Info 21   [3:43:45.385] Elapsed:: 2ms DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Wild card directory
Info 22   [3:43:45.394] Starting updateGraphWorker: Project: /tsjp-resources/sample-projects/symple/tsconfig.json
Info 23   [3:43:45.402] DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple/node_modules 1 Project:  WatchType: node_modules for closed script infos in them
Info 24   [3:43:45.402] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple/node_modules 1 Project:  WatchType: node_modules for closed script infos in them
Info 25   [3:43:46.510] DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/symple/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 26   [3:43:46.511] Elapsed:: 1ms DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/symple/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 27   [3:43:46.511] DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 28   [3:43:46.511] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 29   [3:43:46.511] DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 30   [3:43:46.511] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 31   [3:43:46.512] DirectoryWatcher:: Added:: WatchInfo: /node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 32   [3:43:46.512] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots
Info 33   [3:43:46.512] Finishing updateGraphWorker: Project: /tsjp-resources/sample-projects/symple/tsconfig.json Version: 1 structureChanged: true Elapsed: 1118ms
Info 34   [3:43:46.512] Project '/tsjp-resources/sample-projects/symple/tsconfig.json' (Configured) 
Info 35   [3:43:46.512] 	Files (6)
	/tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.d.ts
	/tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.es5.d.ts
	/tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.dom.d.ts
	/tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.webworker.importscripts.d.ts
	/tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.scripthost.d.ts
	/tsjp-resources/sample-projects/symple/main.ts

Info 36   [3:43:46.512] -----------------------------------------------
Info 37   [3:43:46.513] event:
    {"seq":0,"type":"event","event":"projectLoadingFinish","body":{"projectName":"/tsjp-resources/sample-projects/symple/tsconfig.json"}}
Info 38   [3:43:46.515] event:
    {"seq":0,"type":"event","event":"telemetry","body":{"telemetryEventName":"projectInfo","payload":{"projectId":"ae5a366d488554e73554525d4a4faa320292532fc679691b1c16311b2580af1e","fileStats":{"js":0,"jsSize":0,"jsx":0,"jsxSize":0,"ts":1,"tsSize":25,"tsx":0,"tsxSize":0,"dts":5,"dtsSize":995445,"deferred":0,"deferredSize":0},"compilerOptions":{"target":"es5","module":"commonjs","strict":true,"esModuleInterop":true},"typeAcquisition":{"enable":false,"include":false,"exclude":false},"extends":false,"files":false,"include":false,"exclude":false,"compileOnSave":false,"configFileName":"tsconfig.json","projectType":"configured","languageServiceEnabled":true,"version":"3.5.1"}}}
Info 39   [3:43:46.518] event:
    {"seq":0,"type":"event","event":"configFileDiag","body":{"triggerFile":"/tsjp-resources/sample-projects/symple/main.ts","configFile":"/tsjp-resources/sample-projects/symple/tsconfig.json","diagnostics":[]}}
Info 40   [3:43:46.519] Project '/tsjp-resources/sample-projects/symple/tsconfig.json' (Configured) 0
Info 40   [3:43:46.519] 	Files (6)
	/tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.d.ts
```

---

# Looooooong 😇

---

# How to read tsserver's log

`{ "type": "request", ... }` means a request from the editor.

`{ "command":"completionInfo", ... }` means kind of request.


---

# **2. Virtual File System**

---

## Components in tsserver

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D373%253A0" allowfullscreen></iframe>

---

## Language service & host

- Lanage Service: Analyzes TypeScript project information(errors, types, etc...)
- Lanage Service Host: Provides file information of the project to the language service

```typescript
import * as ts from "typescript";

const host = { ... };
const languageService = ts.createLanguageService(host);

languageService.getQuickInfoAtPosition(...);
```

---

## LanguageServiceHost I/F

```typescript
interface LanguageServiceHost {
  getCompilationSettings(): CompilerOptions;

  getScriptFileNames(): string[];

  getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;

  getScriptVersion(fileName: string): string;
  getCurrentDirectory(): string;
  getDefaultLibFileName(options: CompilerOptions): string;

  /* skip the rest */
}
```

---

## Language service does not depend on Node.js's fs

---

## We can run it on Web browser

---

<iframe class="editorFrame" src="assets/editor/dist/index.html?disabled-logger=true&no-delay=true"></iframe>

---

## How many files are opened ?

---

<iframe class="editorFrame" src="assets/editor/dist/index.html"></iframe>

---

# **3. Mutation of script**

---

![cat_typing](https://media.giphy.com/media/lJNoBCvQYp7nq/giphy.gif)

---

# LSHost needs to accept "what developer changes"

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D401%253A7" allowfullscreen></iframe>


---

## 2 kinds of files watched by tsserver:

* Immutable: e.g. dom.lib.d.ts or libraries' .ts files
* **Mutable: Files you're editing**
  * The changes may not be applied on your file system

It means that tsserver should have not only virtual file sysytem but also the mirror of editor's buffers.  
  
  

tsserver upgrades data structure of the virtual file to `ScriptVersionCache` (SVC) when accepting the file changes.

---

## Script version cache

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D1635%253A1" allowfullscreen></iframe>

---

<iframe class="editorFrame" src="assets/editor/dist/index.html"></iframe>

---

## Data structure of SVC's snapshot

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D428%253A0" allowfullscreen></iframe>

---

## Rope

<img style="height: 30vh;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Vector_Rope_index.svg/1920px-Vector_Rope_index.svg.png" alt="">

[*Rope data structure*](https://en.wikipedia.org/wiki/Rope_(data_structure))

* O(log N) time complexity for insertion/deletion

---

# **4. Mutation of AST**

---

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D428%253A40" allowfullscreen></iframe>

---

## Changes info

```typescript
interface LanguageServiceHost {

  getScriptVersion(fileName: string): string;
  getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;

  /* skip the rest */
}

interface IScriptSnapshot {
  /** Gets a portion of the script snapshot specified by [start, end). */
  getText(start: number, end: number): string;
  /** Gets the length of this script snapshot. */
  getLength(): number;
  /**
   * Gets the TextChangeRange that describe how the text changed between this text and
   * an older version.  This information is used by the incremental parser to determine
   * what sections of the script need to be re-parsed.  'undefined' can be returned if the
   * change range cannot be determined.  However, in that case, incremental parsing will
   * not happen and the entire document will be re - parsed.
   */
  getChangeRange(oldSnapshot: IScriptSnapshot): TextChangeRange | undefined;
  /** Releases all resources held by this script snapshot */
  dispose?(): void;
}
```

---

### TextChangeRange:

> This information is used by the **incremental parser** to determine  
> what sections of the script need to be re-parsed. 

---

## What's incremental parsing ?

---

### Example

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D1635%253A93" allowfullscreen></iframe>

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D862%253A59" allowfullscreen></iframe>

---

### AST before

<iframe class="editorFrame" src="https://astexplorer.net/#/gist/45019fa3a72feaf5649082842653a90f/5ba306a8750ed18347042e477834f1fda82de7d3"></iframe>


---

### AST after

<iframe class="editorFrame" src="https://astexplorer.net/#/gist/45019fa3a72feaf5649082842653a90f/f3c88f1adcc32b9bd713e2cff06a4dcd95228925"></iframe>


---

## 1. Get textChangeRange

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D1635%253A62" allowfullscreen></iframe>

---

## 1. Gets textChangeRange

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D862%253A59" allowfullscreen></iframe>

---

## 2. Make the actual change

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D862%253A39" allowfullscreen></iframe>

---

## 3. Visit each old nodes and mark intersected

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D862%253A0" allowfullscreen></iframe>

---

## FYI: Performance of incremental parsing

---

<iframe width="968" height="598.5927678283317" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRF1eWeNCv2389PiiqCjEXzCWIhvPzkO_mv_WEwYC_gy0bX5wQQvx9RQhKzT1ypvHShpW4tmLtrQOIS/pubchart?oid=462115573&amp;format=image"></iframe>

* x-axis: The numbers of lines of original source code
* y-axis: Time [msec] to parse for 60 times insertion

---

### source

[https://github.com/Quramy/tsjp-resources/blob/master/ls-sample/src/parse-performance.ts](https://github.com/Quramy/tsjp-resources/blob/master/ls-sample/src/parse-performance.ts)

```typescript
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
```

