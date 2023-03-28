import express from "express";
import { getAllSupercarsController } from "../controllers/supercarController";

const router = express.Router();

router.get("/", getAllSupercarsController);

export default router;
