import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import logger from "./logger/logger.js";

import vehicleRoutes from "./routes/vehicleRoutes.js";
import printRoutes from "./routes/printRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

dotenv.config();

//connect DB
connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.use("/api/vehicle", vehicleRoutes);
app.use("/api/print", printRoutes);
app.use("/api/login", loginRoutes);

const port = process.env.CLIENT_NODE_PORT;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
