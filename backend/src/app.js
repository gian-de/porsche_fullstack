import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { IndexEndpoint } from "./routes/IndexEndpoint.js";
import Carrera from "./routes/Carrera.js";
import Cayman from "./routes/Cayman.js";
import Supercar from "./routes/Supercar.js";
import Taycan from "./routes/Taycan.js";
import Panamera from "./routes/Panamera.js";
import Cayenne from "./routes/Cayenne.js";
import Macan from "./routes/Macan.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

// Initial endpoint
app.get("/api/porsche", IndexEndpoint);
// Routes
app.use("/api/porsche/911", Carrera);
app.use("/api/porsche/cayman", Cayman);
app.use("/api/porsche/supercar", Supercar);
app.use("/api/porsche/taycan", Taycan);
app.use("/api/porsche/panamera", Panamera);
app.use("/api/porsche/cayenne", Cayenne);
app.use("/api/porsche/macan", Macan);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}...`);
});
