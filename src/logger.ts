import { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, printf, json } = format;

export const logger = createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    timestamp(),
    printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level}]: ${message}${stack ? "\\n" + stack : ""}`;
    })
  ),
  transports: [
    new transports.Console({
      stderrLevels: [
        "error",
        "warn",
        "info",
        "http",
        "verbose",
        "debug",
        "silly",
      ],
    }),
  ],
});
