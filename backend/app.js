import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { displayModelsAndImages } from "./database.js";

const PORT = process.env.PORT;

const app = express();

app.get("/api/porsche", async (req, res) => {
  const data = await displayModelsAndImages();
  res.json(data);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}...`);
});
