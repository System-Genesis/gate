
import express = require("express");
// import { Request, Response, NextFunction } from "express";
import entityRouter from "./entity.router";
import groupRouter from "./group.router";
import digitalIdentities from "./digitalIdentities.router";
import roleRouter from "./role.router";
export const router = express.Router();

router.use('/entities', entityRouter);
router.use('/groups', groupRouter);
router.use('/digitalIdentities', digitalIdentities);
router.use('/roles', roleRouter);

export default router;
