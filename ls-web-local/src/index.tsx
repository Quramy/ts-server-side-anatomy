import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";

import { LspProvider } from "./contexts/LspContext";
import { rootLogger } from "./logger";

const elm = document.getElementById("app");

rootLogger.getStream().subscribe(x => console.log(x));

if (elm) {
  render((
    <LspProvider>
      <App />
    </LspProvider>
  ), elm);
}
