import * as express from "express";
import * as healthcheck from "@hmcts/nodejs-healthcheck";

export const healthcheckRoutes = express.Router();

const healthCheckConfig = {
  checks: {
    icp: healthcheck.raw(() => {
      return healthcheck.up();
    })
  },
};

healthcheck.addTo(healthcheckRoutes, healthCheckConfig);