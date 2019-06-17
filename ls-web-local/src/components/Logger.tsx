import React, { useEffect, useState, useRef } from "react";
import ReactJson from 'react-json-view'
import { rootLogger, LoggerArguments } from "../logger";
import { css } from "emotion";

const styles = {
  root: css`
    background-color: #ddd;
    overflow-y: scroll;
    height: 100%;
    list-style: none;
    font-size: 1.3rem;
  `,
  item: css`
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid #aaa;
    padding: 2px 32px 2px 10px;
    &:not(:first-of-type) {
      margin-top: 6px;
    }
  `,
  header: css`
    color: #20204e;
    font-family: monospace;
    margin-right: 5px;
  `,
  obj: css`
    flex: auto;
  `,
};

export const Logger = () => {
  const [id, updateId] = useState("");
  const [logs] = useState<LoggerArguments[]>([]);
  const bottomRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    return rootLogger.getStream().subscribe(x => {
      logs.push(x);
      updateId(x.id);
      setTimeout(() => {
        if (bottomRef && bottomRef.current) {
          bottomRef.current.scrollIntoView();
        }
      }, 100);
    }).unsubscribe;
  }, [rootLogger]);
  return (
    <ul className={styles.root}>
      {logs.map(({ id, category, eventName, args })=> (
        <li key={id} className={styles.item}>
          <header className={styles.header}>[{category}:{eventName}]</header>
          {args[0] ? <div className={styles.obj}>
            <ReactJson src={args[0]} collapsed={1} />
          </div>: null}
        </li>
      ))}
      <li ref={bottomRef}></li>
    </ul>
  );
};
