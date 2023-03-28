import express from "express";
import { getAllCayennesController } from "../controllers/cayenneController.js";

const router = express.Router();

router.get("/", getAllCayennesController);

export default router;
