import React, { useContext } from "react";
import { setupEditor } from "../editor";
import { lscContext } from "../contexts/LscContext";
import { conigCtx } from "../contexts/ConfigureContext";

export const Editor = () => {
  const lsp = useContext(lscContext);
  return (
    <div id="editor" ref={ref => setupEditor(ref, lsp)} />
  );
}
