import express from "express";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.use("/api/vehicle", vehicleRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});