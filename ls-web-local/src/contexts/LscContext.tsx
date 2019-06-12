import React, { createContext } from "react";
import { LsClient } from "../editor";

const ctx = createContext<LsClient>(null as any);
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

export class LscProvider extends React.Component<{}, {}> {
  private lsc = new LsClient({
    initialContents: [{ fileName: "/main.ts", content: initalContent }],
  });

  render() {
    return (
      <Provider value={this.lsc}>
        {this.props.children}
      </Provider>
    )
  }
}
