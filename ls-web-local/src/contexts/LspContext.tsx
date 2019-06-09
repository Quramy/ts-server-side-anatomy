import React, { createContext } from "react";
import { LspClient } from "../editor";

const ctx = createContext<LspClient>(null as any);
const { Provider } = ctx;

export const lspContext = ctx;

export class LspProvider extends React.Component<{}, {}> {
  private lspClient = new LspClient({
    initialContents: [{ fileName: "/main.ts", content: "hogehoge\nfugafuga\nconsole.log" }],
  });

  render() {
    return (
      <Provider value={this.lspClient}>
        {this.props.children}
      </Provider>
    )
  }
}
