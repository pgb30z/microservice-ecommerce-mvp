import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

export const httpLogger = pinoHttp({
  logger,

  customProps: (req) => ({
    service: "api-gateway",
  }),

  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed`;
  },

  customErrorMessage: (req, res, error) => {
    return `${req.method} ${req.url} failed: ${error.message}`;
  },
});