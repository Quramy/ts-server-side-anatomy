import React, { useContext } from "react";
import { setupEditor } from "../editor";
import SplitPane from "react-split-pane";
import { lspContext } from "../contexts/LspContext";
import { Errors } from "./Errors";
import { Logger } from "./Logger";

export const Editor = () => {
  const lsp = useContext(lspContext);
  return (
    <SplitPane split="vertical" primary="first" defaultSize={"65%"}>
      <SplitPane split="horizontal" defaultSize={400}>
        <div id="editor" ref={ref => setupEditor(ref, lsp)} />
        <Errors fileName="/main.ts" />
      </SplitPane>
      <Logger />
    </SplitPane>
  );
}
