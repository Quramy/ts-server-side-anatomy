import React, { createContext } from "react";
import { LspClient } from "../editor";

const ctx = createContext<LspClient>(null as any);
const { Provider } = ctx;

export const lspContext = ctx;

const initalContent = `
const x = 1;
const xx = 2;

console.log(sum(x, x));

function sum(a: number, b: number) {
  return a + b;
}
`

export class LspProvider extends React.Component<{}, {}> {
  private lspClient = new LspClient({
    initialContents: [{ fileName: "/main.ts", content: initalContent }],
  });

  render() {
    return (
      <Provider value={this.lspClient}>
        {this.props.children}
      </Provider>
    )
  }
}
