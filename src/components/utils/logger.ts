const isProd = import.meta.env.NODE_ENV === "production";

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProd) console.log(...args);
  },
  error: (...args: unknown[]) => {
    if (!isProd) console.error(...args);
  },
  warn: (...args: unknown[]) => {
    if (!isProd) console.warn(...args);
  },
};
