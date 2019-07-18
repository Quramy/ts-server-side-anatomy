(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{134:function(e,t,o){o(135),o(359),o(355),e.exports=o(356)},337:function(e,t,o){var s={"./0_title.md":338,"./10_agenda.md":339,"./20_main.md":340,"./30_summary.md":353,"./99_thank_you.md":354};function n(e){var t=r(e);return o(t)}function r(e){if(!o.o(s,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return s[e]}n.keys=function(){return Object.keys(s)},n.resolve=r,e.exports=n,n.id=337},338:function(e,t){e.exports='<h1 id="typescript-server-side-anatomy"><strong>TypeScript Server Side Anatomy</strong></h1>\n<h3 id="typescript-meetup-1">TypeScript meetup #1</h3>\n'},339:function(e,t){e.exports='<h2 id="about-me">About me</h2>\n<ul>\n<li>Yosuke Kurami (@Quramy)</li>\n<li>Web front-end developer</li>\n</ul>\n'},340:function(e,t,o){e.exports='<h1 id="btw">BTW</h1>\n<hr>\n<h1 id="have-you-written-something-in-typescript-🙋">Have you written something in TypeScript? 🙋</h1>\n<hr>\n<h1 id="have-you-used-typescripts-language-service-🙋">Have you used TypeScript&#39;s language service? 🙋</h1>\n<hr>\n<h1 id="you-must-have">You must have</h1>\n<hr>\n<h1 id="todays-theme">Today&#39;s theme</h1>\n<hr>\n<h1 id="typescript-editor-whats-under-the-hood"><strong>TypeScript editor, what&#39;s under the hood</strong></h1>\n<hr>\n<h1 id="that-is-">That is ...</h1>\n<img class="figma_fig" src="'+o(341)+'">\n\n<p><a href="https://github.com/microsoft/TypeScript/wiki/Architectural-Overview#layer-overview"><em>Architectural Overview</em></a></p>\n<hr>\n<h1 id="1-editor-agnostic"><strong>1. Editor agnostic</strong></h1>\n<hr>\n<h2 id="functions-what-we-want-for-editorides">Functions what we want for editor/IDEs</h2>\n<ul>\n<li>Error checking</li>\n<li>Completion</li>\n<li>Jump to definition</li>\n<li>Jump to references</li>\n<li>etc...</li>\n</ul>\n<hr>\n<h2 id="its-toooo-tough-to-implement-the-features-as-each-editors-plugin-😇">It&#39;s toooo tough to implement the features as each editor&#39;s plugin 😇</h2>\n<hr>\n<h2 id="no-more-editor-war">No more <a href="https://en.wikipedia.org/wiki/Editor_war">editor war</a>!</h2>\n<p><img src="https://pbs.twimg.com/media/Bhfbnn3CMAA93mg.png:large" alt="editor_war"></p>\n<hr>\n<h2 id="tsserver">tsserver</h2>\n<img class="figma_fig" src="'+o(342)+'">\n\n<p>TypeScript&#39;s server, a.k.a. <strong>tsserver</strong>, gives language functions to editor/IDEs 👍</p>\n<hr>\n<h2 id="features-of-tsserver">Features of tsserver</h2>\n<ul>\n<li>Communicates over STDIO<ul>\n<li>Editor/IDEs need <strong>no JavaScript</strong> code</li>\n</ul>\n</li>\n<li>Using JSON paylod such as JSON RPC protocol</li>\n</ul>\n<hr>\n<h2 id="seeing-is-believing">Seeing is believing</h2>\n<pre><code class="language-ts">function hoge(x: string) {\n  console.log(x);\n}</code></pre>\n<p>Let&#39;s ask to tsserver &quot;What&#39;s type of <code>x</code> at the line: 2 / col: 15&quot;</p>\n<hr>\n<pre><code class="language-bash"># test.sh\n\ncat &lt;&lt; EOF &gt; sample.ts\nfunction hoge(x: string) {\n  console.log(x);\n}\nEOF\n\nnpx tsserver &lt;&lt; EOF | tail -n 1 | jq .body\n{&quot;command&quot;:&quot;open&quot;,&quot;arguments&quot;:{&quot;file&quot;:&quot;${PWD}/sample.ts&quot;}}\n{&quot;command&quot;:&quot;quickinfo&quot;,&quot;arguments&quot;:{&quot;file&quot;:&quot;${PWD}/sample.ts&quot;,&quot;line&quot;:2,&quot;offset&quot;:15}}\nEOF</code></pre>\n<pre><code class="language-bash">$ sh test.sh\n{\n  &quot;kind&quot;: &quot;parameter&quot;,\n  &quot;kindModifiers&quot;: &quot;&quot;,\n  &quot;start&quot;: {\n    &quot;line&quot;: 2,\n    &quot;offset&quot;: 15\n  },\n  &quot;end&quot;: {\n    &quot;line&quot;: 2,\n    &quot;offset&quot;: 16\n  },\n  &quot;displayString&quot;: &quot;(parameter) x: string&quot;,\n  &quot;documentation&quot;: &quot;&quot;,\n  &quot;tags&quot;: []\n}</code></pre>\n<hr>\n<h2 id="another-real-world-example">Another, real world example</h2>\n<pre><code class="language-bash">$ export TSS_LOG=&quot;-file `pwd`/tsserver.log -level verbose&quot;\n$ code .</code></pre>\n<hr>\n<pre><code class="language-txt">Info 0    [3:43:45.342] Starting TS Server\nInfo 1    [3:43:45.342] Version: 3.5.1\nInfo 2    [3:43:45.342] Arguments: /Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper.app/Contents/MacOS/Code Helper /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --enableTelemetry --cancellationPipeName /var/folders/bc/t99h94ls1k9c59bcjtkx3tmr0000gn/T/vscode-typescript/tscancellation-df93638a114cbddaa780.tmp* --locale en --noGetErrOnBackgroundUpdate --validateDefaultNpmLocation\nInfo 3    [3:43:45.342] Platform: darwin NodeVersion: 10 CaseSensitive: false\nInfo 4    [3:43:45.347] Binding...\nInfo 5    [3:43:45.353] request:\n    {&quot;seq&quot;:0,&quot;type&quot;:&quot;request&quot;,&quot;command&quot;:&quot;configure&quot;,&quot;arguments&quot;:{&quot;hostInfo&quot;:&quot;vscode&quot;,&quot;preferences&quot;:{&quot;providePrefixAndSuffixTextForRename&quot;:true,&quot;allowRenameOfImportPath&quot;:true}}}\nInfo 6    [3:43:45.354] Host information vscode\nInfo 7    [3:43:45.354] response:\n    {&quot;seq&quot;:0,&quot;type&quot;:&quot;response&quot;,&quot;command&quot;:&quot;configure&quot;,&quot;request_seq&quot;:0,&quot;success&quot;:true}\nPerf 8    [3:43:45.356] 0::configure: async elapsed time (in milliseconds) 2.6602\nInfo 9    [3:43:45.356] request:\n    {&quot;seq&quot;:1,&quot;type&quot;:&quot;request&quot;,&quot;command&quot;:&quot;compilerOptionsForInferredProjects&quot;,&quot;arguments&quot;:{&quot;options&quot;:{&quot;module&quot;:&quot;commonjs&quot;,&quot;target&quot;:&quot;es2016&quot;,&quot;jsx&quot;:&quot;preserve&quot;,&quot;allowJs&quot;:true,&quot;allowSyntheticDefaultImports&quot;:true,&quot;allowNonTsExtensions&quot;:true}}}\nInfo 10   [3:43:45.359] Scheduled: *ensureProjectForOpenFiles*\nPerf 11   [3:43:45.359] 1::compilerOptionsForInferredProjects: elapsed time (in milliseconds) 2.6574\nInfo 12   [3:43:45.359] response:\n    {&quot;seq&quot;:0,&quot;type&quot;:&quot;response&quot;,&quot;command&quot;:&quot;compilerOptionsForInferredProjects&quot;,&quot;request_seq&quot;:1,&quot;success&quot;:true,&quot;body&quot;:true}\nInfo 13   [3:43:45.359] request:\n    {&quot;seq&quot;:2,&quot;type&quot;:&quot;request&quot;,&quot;command&quot;:&quot;updateOpen&quot;,&quot;arguments&quot;:{&quot;openFiles&quot;:[{&quot;file&quot;:&quot;/tsjp-resources/sample-projects/symple/main.ts&quot;,&quot;fileContent&quot;:&quot;const b = 1;\\nconst a = b;&quot;,&quot;scriptKindName&quot;:&quot;TS&quot;,&quot;projectRootPath&quot;:&quot;/tsjp-resources/sample-projects/symple&quot;}]}}\nInfo 14   [3:43:45.362] Search path: /tsjp-resources/sample-projects/symple\nInfo 15   [3:43:45.362] ConfigFilePresence:: Current Watches: :: File: /tsjp-resources/sample-projects/symple/tsconfig.json Currently impacted open files: RootsOfInferredProjects:  OtherOpenFiles: /tsjp-resources/sample-projects/symple/main.ts Status: File added to open files impacted by this config file\nInfo 16   [3:43:45.362] For info: /tsjp-resources/sample-projects/symple/main.ts :: Config file name: /tsjp-resources/sample-projects/symple/tsconfig.json\nInfo 17   [3:43:45.363] Opened configuration file /tsjp-resources/sample-projects/symple/tsconfig.json\nInfo 18   [3:43:45.365] FileWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/symple/tsconfig.json 2000 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Config file\nInfo 19   [3:43:45.366] event:\n    {&quot;seq&quot;:0,&quot;type&quot;:&quot;event&quot;,&quot;event&quot;:&quot;projectLoadingStart&quot;,&quot;body&quot;:{&quot;projectName&quot;:&quot;/tsjp-resources/sample-projects/symple/tsconfig.json&quot;,&quot;reason&quot;:&quot;Creating possible configured project for /tsjp-resources/sample-projects/symple/main.ts to open&quot;}}\nInfo 20   [3:43:45.383] DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Wild card directory\nInfo 21   [3:43:45.385] Elapsed:: 2ms DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Wild card directory\nInfo 22   [3:43:45.394] Starting updateGraphWorker: Project: /tsjp-resources/sample-projects/symple/tsconfig.json\nInfo 23   [3:43:45.402] DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple/node_modules 1 Project:  WatchType: node_modules for closed script infos in them\nInfo 24   [3:43:45.402] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /users/yosuke/workspace/javascript/tsjp-resources/sample-projects/symple/node_modules 1 Project:  WatchType: node_modules for closed script infos in them\nInfo 25   [3:43:46.510] DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/symple/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 26   [3:43:46.511] Elapsed:: 1ms DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/symple/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 27   [3:43:46.511] DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 28   [3:43:46.511] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/sample-projects/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 29   [3:43:46.511] DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 30   [3:43:46.511] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /tsjp-resources/node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 31   [3:43:46.512] DirectoryWatcher:: Added:: WatchInfo: /node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 32   [3:43:46.512] Elapsed:: 0ms DirectoryWatcher:: Added:: WatchInfo: /node_modules/@types 1 Project: /tsjp-resources/sample-projects/symple/tsconfig.json WatchType: Type roots\nInfo 33   [3:43:46.512] Finishing updateGraphWorker: Project: /tsjp-resources/sample-projects/symple/tsconfig.json Version: 1 structureChanged: true Elapsed: 1118ms\nInfo 34   [3:43:46.512] Project &#39;/tsjp-resources/sample-projects/symple/tsconfig.json&#39; (Configured) \nInfo 35   [3:43:46.512]     Files (6)\n    /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.d.ts\n    /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.es5.d.ts\n    /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.dom.d.ts\n    /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.webworker.importscripts.d.ts\n    /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.scripthost.d.ts\n    /tsjp-resources/sample-projects/symple/main.ts\n\nInfo 36   [3:43:46.512] -----------------------------------------------\nInfo 37   [3:43:46.513] event:\n    {&quot;seq&quot;:0,&quot;type&quot;:&quot;event&quot;,&quot;event&quot;:&quot;projectLoadingFinish&quot;,&quot;body&quot;:{&quot;projectName&quot;:&quot;/tsjp-resources/sample-projects/symple/tsconfig.json&quot;}}\nInfo 38   [3:43:46.515] event:\n    {&quot;seq&quot;:0,&quot;type&quot;:&quot;event&quot;,&quot;event&quot;:&quot;telemetry&quot;,&quot;body&quot;:{&quot;telemetryEventName&quot;:&quot;projectInfo&quot;,&quot;payload&quot;:{&quot;projectId&quot;:&quot;ae5a366d488554e73554525d4a4faa320292532fc679691b1c16311b2580af1e&quot;,&quot;fileStats&quot;:{&quot;js&quot;:0,&quot;jsSize&quot;:0,&quot;jsx&quot;:0,&quot;jsxSize&quot;:0,&quot;ts&quot;:1,&quot;tsSize&quot;:25,&quot;tsx&quot;:0,&quot;tsxSize&quot;:0,&quot;dts&quot;:5,&quot;dtsSize&quot;:995445,&quot;deferred&quot;:0,&quot;deferredSize&quot;:0},&quot;compilerOptions&quot;:{&quot;target&quot;:&quot;es5&quot;,&quot;module&quot;:&quot;commonjs&quot;,&quot;strict&quot;:true,&quot;esModuleInterop&quot;:true},&quot;typeAcquisition&quot;:{&quot;enable&quot;:false,&quot;include&quot;:false,&quot;exclude&quot;:false},&quot;extends&quot;:false,&quot;files&quot;:false,&quot;include&quot;:false,&quot;exclude&quot;:false,&quot;compileOnSave&quot;:false,&quot;configFileName&quot;:&quot;tsconfig.json&quot;,&quot;projectType&quot;:&quot;configured&quot;,&quot;languageServiceEnabled&quot;:true,&quot;version&quot;:&quot;3.5.1&quot;}}}\nInfo 39   [3:43:46.518] event:\n    {&quot;seq&quot;:0,&quot;type&quot;:&quot;event&quot;,&quot;event&quot;:&quot;configFileDiag&quot;,&quot;body&quot;:{&quot;triggerFile&quot;:&quot;/tsjp-resources/sample-projects/symple/main.ts&quot;,&quot;configFile&quot;:&quot;/tsjp-resources/sample-projects/symple/tsconfig.json&quot;,&quot;diagnostics&quot;:[]}}\nInfo 40   [3:43:46.519] Project &#39;/tsjp-resources/sample-projects/symple/tsconfig.json&#39; (Configured) 0\nInfo 40   [3:43:46.519]     Files (6)\n    /tsjp-resources/sample-projects/symple/node_modules/typescript/lib/lib.d.ts</code></pre>\n<hr>\n<h1 id="looooooong-😇">Looooooong 😇</h1>\n<hr>\n<h1 id="how-to-read-tsservers-log">How to read tsserver&#39;s log</h1>\n<p><code>{ &quot;type&quot;: &quot;request&quot;, ... }</code> means a request from the editor.</p>\n<p><code>{ &quot;command&quot;:&quot;completionInfo&quot;, ... }</code> means kind of request.</p>\n<hr>\n<h1 id="2-virtual-file-system"><strong>2. Virtual File System</strong></h1>\n<hr>\n<h2 id="components-in-tsserver">Components in tsserver</h2>\n<img class="figma_fig" src="'+o(343)+'">\n\n<hr>\n<h2 id="language-service--host">Language service &amp; host</h2>\n<ul>\n<li>Lanage Service: Analyzes TypeScript project information(errors, types, etc...)</li>\n<li>Lanage Service Host: Provides file information of the project to the language service</li>\n</ul>\n<pre><code class="language-typescript">import * as ts from &quot;typescript&quot;;\n\nconst host = { ... };\nconst languageService = ts.createLanguageService(host);\n\nlanguageService.getQuickInfoAtPosition(...);</code></pre>\n<hr>\n<h2 id="languageservicehost-if">LanguageServiceHost I/F</h2>\n<pre><code class="language-typescript">interface LanguageServiceHost {\n  getCompilationSettings(): CompilerOptions;\n\n  getScriptFileNames(): string[];\n\n  getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;\n\n  getScriptVersion(fileName: string): string;\n  getCurrentDirectory(): string;\n  getDefaultLibFileName(options: CompilerOptions): string;\n\n  /* skip the rest */\n}</code></pre>\n<hr>\n<h2 id="language-service-does-not-depend-on-nodejss-fs">Language service does not depend on Node.js&#39;s fs</h2>\n<hr>\n<h2 id="we-can-run-it-on-web-browser">We can run it on Web browser</h2>\n<hr>\n<iframe class="editorFrame" src="assets/editor/dist/index.html?disabled-logger=true&no-delay=true"></iframe>\n\n<hr>\n<h2 id="how-many-files-are-opened-">How many files are opened ?</h2>\n<hr>\n<iframe class="editorFrame" src="assets/editor/dist/index.html"></iframe>\n\n<hr>\n<h1 id="3-mutation-of-script"><strong>3. Mutation of script</strong></h1>\n<hr>\n<p><img src="https://media.giphy.com/media/lJNoBCvQYp7nq/giphy.gif" alt="cat_typing"></p>\n<hr>\n<h1 id="lshost-needs-to-accept-what-developer-changes">LSHost needs to accept &quot;what developer changes&quot;</h1>\n<img class="figma_fig" src="'+o(344)+'">\n\n\n<hr>\n<h2 id="2-kinds-of-files-watched-by-tsserver">2 kinds of files watched by tsserver:</h2>\n<ul>\n<li>Immutable: e.g. dom.lib.d.ts or libraries&#39; .ts files</li>\n<li><strong>Mutable: Files you&#39;re editing</strong><ul>\n<li>The changes may not be applied on your file system</li>\n</ul>\n</li>\n</ul>\n<p>It means that tsserver should have not only virtual file sysytem but also the mirror of editor&#39;s buffers.  </p>\n<p>tsserver upgrades data structure of the virtual file to <code>ScriptVersionCache</code> (SVC) when accepting the file changes.</p>\n<hr>\n<h2 id="script-version-cache">Script version cache</h2>\n<img class="figma_fig" src="'+o(345)+'">\n\n<hr>\n<iframe class="editorFrame" src="assets/editor/dist/index.html"></iframe>\n\n<hr>\n<h2 id="data-structure-of-svcs-snapshot">Data structure of SVC&#39;s snapshot</h2>\n<img class="figma_fig" src="'+o(346)+'">\n\n<hr>\n<h2 id="rope">Rope</h2>\n<img style="height: 30vh;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Vector_Rope_index.svg/1920px-Vector_Rope_index.svg.png" alt="">\n\n<p><a href="https://en.wikipedia.org/wiki/Rope_(data_structure)"><em>Rope data structure</em></a></p>\n<ul>\n<li>O(log N) time complexity for insertion/deletion</li>\n</ul>\n<hr>\n<h1 id="4-mutation-of-ast"><strong>4. Mutation of AST</strong></h1>\n<hr>\n<img class="figma_fig" src="'+o(347)+'">\n\n<hr>\n<h2 id="changes-info">Changes info</h2>\n<pre><code class="language-typescript">interface LanguageServiceHost {\n\n  getScriptVersion(fileName: string): string;\n  getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;\n\n  /* skip the rest */\n}\n\ninterface IScriptSnapshot {\n  /** Gets a portion of the script snapshot specified by [start, end). */\n  getText(start: number, end: number): string;\n  /** Gets the length of this script snapshot. */\n  getLength(): number;\n  /**\n   * Gets the TextChangeRange that describe how the text changed between this text and\n   * an older version.  This information is used by the incremental parser to determine\n   * what sections of the script need to be re-parsed.  &#39;undefined&#39; can be returned if the\n   * change range cannot be determined.  However, in that case, incremental parsing will\n   * not happen and the entire document will be re - parsed.\n   */\n  getChangeRange(oldSnapshot: IScriptSnapshot): TextChangeRange | undefined;\n  /** Releases all resources held by this script snapshot */\n  dispose?(): void;\n}</code></pre>\n<hr>\n<h3 id="textchangerange">TextChangeRange:</h3>\n<blockquote>\n<p>This information is used by the <strong>incremental parser</strong> to determine<br>what sections of the script need to be re-parsed. </p>\n</blockquote>\n<hr>\n<h2 id="whats-incremental-parsing-">What&#39;s incremental parsing ?</h2>\n<hr>\n<h3 id="example">Example</h3>\n<img class="figma_fig" src="'+o(348)+'">\n\n<hr>\n<h3 id="ast-before">AST before</h3>\n<iframe class="editorFrame" src="https://astexplorer.net/#/gist/45019fa3a72feaf5649082842653a90f/5ba306a8750ed18347042e477834f1fda82de7d3"></iframe>\n\n\n<hr>\n<h3 id="ast-after">AST after</h3>\n<iframe class="editorFrame" src="https://astexplorer.net/#/gist/45019fa3a72feaf5649082842653a90f/f3c88f1adcc32b9bd713e2cff06a4dcd95228925"></iframe>\n\n\n<hr>\n<h2 id="1-get-textchangerange">1. Get textChangeRange</h2>\n<img class="figma_fig" src="'+o(349)+'">\n\n<hr>\n<h2 id="1-gets-textchangerange">1. Gets textChangeRange</h2>\n<img class="figma_fig" src="'+o(350)+'">\n\n<hr>\n<h2 id="2-make-the-actual-change">2. Make the actual change</h2>\n<img class="figma_fig" src="'+o(351)+'">\n\n<hr>\n<h2 id="3-visit-each-old-nodes-and-mark-intersected">3. Visit each old nodes and mark intersected</h2>\n<img class="figma_fig" src="'+o(352)+'">\n\n<hr>\n<h2 id="fyi-performance-of-incremental-parsing">FYI: Performance of incremental parsing</h2>\n<hr>\n<iframe class="chart_small" width="481.61044176706827" height="243.1701154772515" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRF1eWeNCv2389PiiqCjEXzCWIhvPzkO_mv_WEwYC_gy0bX5wQQvx9RQhKzT1ypvHShpW4tmLtrQOIS/pubchart?oid=462115573&amp;format=image"></iframe>\n\n<iframe class="chart_big" width="1049.4099037138926" height="581.0263455092004" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRF1eWeNCv2389PiiqCjEXzCWIhvPzkO_mv_WEwYC_gy0bX5wQQvx9RQhKzT1ypvHShpW4tmLtrQOIS/pubchart?oid=1945554416&amp;format=image"></iframe>\n\n<ul>\n<li>x-axis: The numbers of lines of original source code</li>\n<li>y-axis: Time [msec] to parse for 60 times insertion</li>\n</ul>\n<hr>\n<h3 id="source">source</h3>\n<p><a href="https://github.com/Quramy/tsjp-resources/blob/master/ls-sample/src/parse-performance.ts">https://github.com/Quramy/tsjp-resources/blob/master/ls-sample/src/parse-performance.ts</a></p>\n<pre><code class="language-typescript">import * as ts from &quot;typescript&quot;;\n\nconst insertText = &quot;\\ndeclare namespace hoge { export function fooobar(): void; }&quot;\n\nconst rangeItems = (n: number) =&gt; {\n  const arr = [];\n  for(let i = 0; i &lt; n; i++) {\n    arr[i] = i;\n  }\n  return arr;\n};\n\nfunction checkPerf(lines: number) {\n  const originalSourceText = `declare namespace fuga {\n${rangeItems(lines - 3).map((_, i) =&gt; &quot;  function fn&quot; + i + &quot;(): number;&quot;).join(&quot;\\n&quot;)}\n}\n  `;\n\n  const origSource = ts.createSourceFile(&quot;index.d.ts&quot;, originalSourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);\n\n  const s1 = Date.now();\n  let sourceFile = origSource;\n  for (let i = 0; i &lt; insertText.length; i++) {\n    const pos = sourceFile.end;\n    sourceFile = ts.updateSourceFile(sourceFile, sourceFile.getText() + insertText[i], { newLength: 1, span: { start: pos, length: 0 } });\n  }\n  const e1 = Date.now();\n\n  const s2 = Date.now();\n  for (let i = 0; i &lt; insertText.length; i++) {\n    const origSource = ts.createSourceFile(&quot;index.d.ts&quot;, originalSourceText + insertText.slice(0, i), ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);\n  }\n  const e2 = Date.now();\n\n  console.log(&quot;==================================&quot;)\n  console.log(`originalSourceText lines: ${originalSourceText.split(&quot;\\n&quot;).length}`);\n  console.log(`originalSourceText length: ${originalSourceText.length}`);\n  console.log(`insertText length: ${insertText.length}`);\n  console.log(`elapsed time with incremental parsing: ${e1 - s1}`);\n  console.log(`elapsed time with non-incremental parsing: ${e2 - s2}`);\n  console.log(&quot;&quot;);\n}\n\ncheckPerf(100);\ncheckPerf(500);\ncheckPerf(1000);\ncheckPerf(5000);\ncheckPerf(10000);</code></pre>\n'},341:function(e,t,o){e.exports=o.p+"b3f7c67b2e68fc6a5bfe8e2cca1402c9.png"},342:function(e,t,o){e.exports=o.p+"3a342a89fb6da162ca2d623d0c5c4f5d.png"},343:function(e,t,o){e.exports=o.p+"78f3c05622deaf306a3b12cd4f527453.png"},344:function(e,t,o){e.exports=o.p+"47063633dfdb2f49d2032c0cf32067f8.png"},345:function(e,t,o){e.exports=o.p+"ea7d7fcf946abcc57cae8e2a08ea9772.png"},346:function(e,t,o){e.exports=o.p+"9d7be3c9198f078749c3df32b548dd4f.png"},347:function(e,t,o){e.exports=o.p+"190a52714cc9231cc418e5110d6ff424.png"},348:function(e,t,o){e.exports=o.p+"2f974ca718018804d1fca35b4432d022.png"},349:function(e,t,o){e.exports=o.p+"39bb5fb8b015f6a440cd61ab30ea01ed.png"},350:function(e,t,o){e.exports=o.p+"c5bf5438666402b2e45a7489d013b1b5.png"},351:function(e,t,o){e.exports=o.p+"39efe821dbe773ca446b4d05d3dc2bcf.png"},352:function(e,t,o){e.exports=o.p+"0b39d69d36b93cff5dbeb701db012337.png"},353:function(e,t){e.exports='<h2 id="summray"><strong>Summray</strong></h2>\n<hr>\n<h3 id="typescript-server-implements">TypeScript server implements:</h3>\n<ul>\n<li>Editor agnostic protocol</li>\n<li>High-performance mutation<ul>\n<li>Script file updating</li>\n<li>Incremental parsing</li>\n</ul>\n</li>\n</ul>\n<hr>\n<h1 id="tsserver-is-awesome-😎"><strong>tsserver is awesome</strong> 😎</h1>\n'},354:function(e,t){e.exports='<h1 id="thank-you">Thank you!</h1>\n<p><a href="https://github.com/Quramy/tsjp-resources"><em>https://github.com/Quramy/tsjp-resources</em></a></p>\n'},355:function(e,t){},357:function(e,t,o){var s=o(358);"string"==typeof s&&(s=[[e.i,s,""]]);var n={hmr:!0,transform:void 0,insertInto:void 0};o(50)(s,n);s.locals&&(e.exports=s.locals)},358:function(e,t,o){}},[[134,3,5]],[0]]);