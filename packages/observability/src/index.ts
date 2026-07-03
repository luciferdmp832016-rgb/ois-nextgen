import pino from "pino";

export const logger = pino({
  name: "ois-nextgen",
  level: process.env.LOG_LEVEL ?? "info"
});
