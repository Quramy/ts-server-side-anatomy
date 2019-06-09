import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";

import { LspProvider } from "./contexts/LspContext";

const elm = document.getElementById("app");

if (elm) {
  render((
    <LspProvider>
      <App />
    </LspProvider>
  ), elm);
}
