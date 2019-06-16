import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";

import { LscProvider } from "./contexts/LscContext";
import { rootLogger } from "./logger";
import { ConfigProvider, conigCtx } from "./contexts/ConfigureContext";

const elm = document.getElementById("app");

rootLogger.getStream().subscribe(x => console.log(x));

if (elm) {
  const { Consumer } = conigCtx;
  render((
    <ConfigProvider>
      <Consumer>
        {({ initial }) => <LscProvider config={initial}><App /></LscProvider>}
      </Consumer>
    </ConfigProvider>
  ), elm);
}
