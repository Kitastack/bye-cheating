import {
  getReport,
  createReport,
  updateReport,
  updateReportItems,
} from "@controllers/report.controller";
import { authenticateToken } from "@libs/jwt.lib";
import express from "express";
const reportRouter = express.Router();

reportRouter.get("/", authenticateToken(), getReport);
reportRouter.post("/", authenticateToken(), createReport);
reportRouter.patch("/", authenticateToken(), updateReport);
reportRouter.patch("/items", authenticateToken(), updateReportItems);

export { reportRouter };
