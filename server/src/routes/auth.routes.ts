import {router} from "express";
import {register} from "../controllers/auth.controller";
import Router = require("express");
const router = Router();
router.post('/register', register);
export default router;