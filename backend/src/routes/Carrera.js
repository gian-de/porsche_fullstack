import express from "express";
import { getAllCarrerasController } from "../controllers/carreraController";

const router = express.Router();

router.get("/", getAllCarrerasController);

export default router;
