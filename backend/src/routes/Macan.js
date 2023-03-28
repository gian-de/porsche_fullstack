import express from "express";
import { getAllMacansController } from "../controllers/macanController.js";

const router = express.Router();

router.get("/", getAllMacansController);

export default router;
