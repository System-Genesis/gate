
import express = require("express");
// import { Request, Response, NextFunction } from "express";
import entityRouter from "./entity.router";
import groupRouter from "./group.router";
import digitalIdentitiesRouter from "./digitalIdentities.router";
import roleRouter from "./role.router";
import isAuth from '../middlewares/auth';
export const router = express.Router();

router.use(isAuth);

router.use('/entities', entityRouter);
router.use('/groups', groupRouter);
router.use('/digitalIdentities', digitalIdentitiesRouter);
router.use('/roles', roleRouter);

export default router;
