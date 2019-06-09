import React, { useState, useContext, useEffect } from "react";
import { lspContext } from "../contexts/LspContext";
import { StreamType } from "../types";
import { css } from "emotion";

const styles = {
  root: css`
    background-color: #2f3129;
    color: red;
    min-height: 200px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;
  `,
  list: css`
    padding: 8px 50px;
  `,
  item: css`
    &:not(:first-child) {
      margin-top: 4px;
    }
  `,
  col: css`
    margin-right: 8px;
  `,
};

export type Props = {
  fileName: string,
}
export const Errors = ({ fileName }: Props) => {
  const lspClient = useContext(lspContext);
  const errors$ = lspClient.getErrors$(fileName);
  const [errors, updateErrors] = useState<StreamType<typeof errors$>>([]);

  useEffect(() => {
    const subscription = errors$.subscribe(updateErrors);
    return subscription.unsubscribe;
  }, [lspClient]);

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {errors.map(error => (
          <li className={styles.item} key={error.key}>
            <span className={styles.col}>{error.row + 1}:{error.column + 1}</span>
            <span className={styles.col}>[TS{error.code}]</span>
            <span className={styles.col}>{error.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
