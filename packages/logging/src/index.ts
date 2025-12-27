import type { Logger } from "@tansui/types";

export function createConsoleLogger(): Logger {
  return {
    info(message, fields) {
      console.log(message, fields ?? {});
    },
    error(message, fields) {
      console.error(message, fields ?? {});
    },
    debug(message, fields) {
      console.debug(message, fields ?? {});
    },
  };
}
