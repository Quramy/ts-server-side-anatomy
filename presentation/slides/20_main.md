# ところで

---

# TypeScript書いたことある人 🙋

---

# Language Service使ったことある人 🙋

---

# きっと使ったことがあるはず

---

# Today's theme

---

# **潜入！TypeScriptエディタの裏側**

---

# 要するにこの辺の話

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D220%253A0" allowfullscreen></iframe>

[*Architectural Overview*](https://github.com/microsoft/TypeScript/wiki/Architectural-Overview#layer-overview) より

---

# **1. Editor agnostic**

---

## 求められる言語サポート

- エラーチェック
- コード補完
- 定義元へのジャンプ
- 呼び出し元への参照
- etc...

---

### 言語サポートをエディタごとに実装するのは大変 😇

不要な宗教論争の元にもなりかねない

---

## tsserver

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FDhwRUPAASvvdlFcM0BlRYhE3%2Fts-meetup-images%3Fnode-id%3D222%253A2" allowfullscreen></iframe>

エディタを問わずにTypeScriptの言語サポートが得られる 👍

---

## tsserverの特徴

* エディタ - tsserver 間はSTDIO通信。JavaScript不要！
* ペイロードはJSON

---

## 百聞は一見に如かず

```ts
function hoge(x: string) {
  console.log(x);
}
```

「2行目15列目の変数 `x` の型は何？」をtsserverに聞いてみよう

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

## もうちょいガチなやつ

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

# 長い 😇

---

# 読み方

`{ "type": "request", ... }` ってなってるとこがエディタからのリクエスト

`{ "command":"completionInfo", ... }` ってなってるのが、リクエストの種類（要するにメソッド）


---

# **2. Virtual File System**

---

## tsserverの中身

IMG

---

## Language Service & Host

- Lanage Service: TypeScript プロジェクトの情報を解析する
- Lanage Service Host: Language ServiceにTypeScript プロジェクトのファイル情報を提供する

```typescript
import * as ts from "typescript";

const host = { ... };
const languageService = ts.createLanguageService(host);

languageService.getQuickInfoAtPosition(...);
```

---

## Language Service Host I/F

```typescript
interface LanguageServiceHost {
  getCompilationSettings(): CompilerOptions;

  // ファイル名の一覧を返す
  getScriptFileNames(): string[];

  // ファイル名からファイルを返す
  getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;

  getScriptVersion(fileName: string): string;
  getCurrentDirectory(): string;
  getDefaultLibFileName(options: CompilerOptions): string;
  /* 以下略 */
}
```

---

## Language ServiceはNode.jsのfsに依存してない

---

## ブラウザでLanguage Serviceを動かすことも可能

---

<iframe class="editorFrame" src="assets/editor/dist/index.html"></iframe>

---

## State of Language Service Host

- Language Service Hostはエディタのバッファをstateとして管理している
- バッファの変更を検知して、自身の管理するスクリプトのスナップショットが更新されたことを通知する責務がある
  - `getScriptVersion(fileName: string): string;`
  - `getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;`

---

## ts.IScriptSnapshot

```typescript
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

## Language Serviceの実行フロー

### 例: エラー取得

---

## エディタからの更新

- (エディタ -> セッション): バッファの変更内容(position, insertedText)を通知
- (セッション -> LanguageServiceHost): 変更内容に従って、自身が管理するファイル情報を更新する
  - バッファに該当するファイルのversionが上がる

---

## エラー情報の取得

- (エディタ -> セッション): エラー情報取得を依頼
- (セッション -> languageService): エラー情報取得メソッド(getSemanticDeagnosticsなど)を実行
- (LanguageService -> LanguageServiceHost): ファイルのversionを取得して変更有無を確認
- (LanguageService -> LanguageServiceHost): 変更が発生したファイルの変更発生範囲( `IScriptSnapshot#getChangeRange` )を取得

---

# **3. Mutation**
