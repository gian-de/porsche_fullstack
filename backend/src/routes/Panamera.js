import express from "express";
import { getAllPanamerasController } from "../controllers/panameraController.js";

const router = express.Router();

router.get("/", getAllPanamerasController);

export default router;
