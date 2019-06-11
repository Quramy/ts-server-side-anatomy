import { ReplaySubject } from "rxjs";

export type LoggerArguments = {
  id: string,
  category: string,
  eventName: string,
  args: any[],
};

let version = 0;

const subject = new ReplaySubject<LoggerArguments>(200);

export const rootLogger = {
  log(category: string, eventName: string, ...args: any[]) {
    subject.next({ id: ++version + "", category, eventName, args });
  },
  getCategory(category: string) {
    return {
      log(eventName: string, ...args: any[]) {
        subject.next({ id: ++version + "", category, eventName, args });
      }
    };
  },
  getStream() {
    return subject.asObservable();
  },
};
