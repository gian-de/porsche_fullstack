import express from "express";
import { getAllCaymansController } from "../controllers/caymanController";

const router = express.Router();

router.get("/", getAllCaymansController);

export default router;
