import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";

import { LscProvider } from "./contexts/LscContext";
import { rootLogger } from "./logger";

const elm = document.getElementById("app");

rootLogger.getStream().subscribe(x => console.log(x));

if (elm) {
  render((
    <LscProvider>
      <App />
    </LscProvider>
  ), elm);
}
