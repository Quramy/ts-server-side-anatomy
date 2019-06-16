import React, { useContext, createContext } from "react";
import { Configuration } from "../types";
import { LsClient } from "../lang-service-client";

const ctx = createContext<LsClient>(null as any);
const { Provider } = ctx;

export type Props = {
  config: Configuration,
};

export class LscProvider extends React.Component<Props> {
  private lsc = new LsClient({
    initialContents: [{ fileName: "/main.ts", content: this.props.config.initialContent }],
    debounceTime: this.props.config.debounceTime,
  });

  render() {
    return (
      <Provider value={this.lsc}>
        {this.props.children}
      </Provider>
    )
  }
}

export const lscContext = ctx;
