import express from "express";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.use("/api/vehicle", vehicleRoutes);

const port = process.env.CLIENT_NODE_PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});