import React, { useContext } from "react";
import { setupEditor } from "../editor";
import SplitPane from "react-split-pane";
import { Errors } from "./Errors";
import { Logger } from "./Logger";
import { Editor } from "./Editor";
import { conigCtx } from "../contexts/ConfigureContext";

export const App = () => {
  const config = useContext(conigCtx);
  const { showLogger } = config.initial;
  if (showLogger) {
    return (
      <SplitPane split="vertical" primary="first" defaultSize={"45%"}>
        <SplitPane split="horizontal" defaultSize={400}>
          <Editor />
          <Errors fileName="/main.ts" />
        </SplitPane>
        <Logger />
      </SplitPane>
    );
  } else {
    return (
      <SplitPane split="horizontal" defaultSize={400}>
        <Editor />
        <Errors fileName="/main.ts" />
      </SplitPane>
    );
  }
}
