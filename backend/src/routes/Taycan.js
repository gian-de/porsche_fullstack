import express from "express";
import { getAllTaycansController } from "../controllers/taycanController.js";

const router = express.Router();

router.get("/", getAllTaycansController);

export default router;
