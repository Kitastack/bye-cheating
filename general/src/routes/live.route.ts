import express from "express";
import { authenticateToken } from "@libs/jwt.lib";
import { createLive, getLive, updateLive } from "@controllers/live.controller";
const liveRouter = express.Router();

liveRouter.get("/", authenticateToken(), getLive);
liveRouter.post("/", authenticateToken(), createLive);
liveRouter.patch("/", authenticateToken(), updateLive);

export { liveRouter };
