import React, { createContext } from "react";
import { BehaviorSubject } from "rxjs";

import { Configuration, Optional } from "../types";
import { Observable } from "rxjs";

export type ConfigHolder = {
  initial: Configuration,
  stream: Observable<Configuration>,
}

export const conigCtx = createContext<ConfigHolder>(null as any);
    
const content = `const num1 = 1;
const num2 = 1;

function sum(x: number, y: number) {
  return x + y;
}

console.log(sum(num1, ));`;

const { Provider } = conigCtx;

export class ConfigProvider extends React.Component {

  configHolder: ConfigHolder;

  constructor(props: { }) {
    super(props);
    const q = new URLSearchParams(location.search);
    
    const initalConfig: Configuration = {
      showLogger: q.get("disabled-logger") === "true" ? false : true,
      useComplete: q.get("disabled-completion") === "true" ? false : true,
      debounceTime: q.get("no-delay") === "true" ? 100: 1500,
      initialContent: content,
    };
    
    this.configHolder = {
      initial: initalConfig,
      stream: new BehaviorSubject(initalConfig),
    };
  }

  render() {
    return (
      <Provider value={this.configHolder}>
        {this.props.children}
      </Provider>
    )
  }

}

