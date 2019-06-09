import React, { useContext } from "react";
import { setupEditor } from "../editor";
import SplitPane from "react-split-pane";
import { lspContext } from "../contexts/LspContext";
import { Errors } from "./Errors";

export const Editor = () => {
  const lsp = useContext(lspContext);
  return (
    <SplitPane split="horizontal" defaultSize={700}>
      <div id="editor" ref={ref => setupEditor(ref, lsp)} />
      <div>
        <Errors fileName="/main.ts" />
      </div>
    </SplitPane>
  );
}
