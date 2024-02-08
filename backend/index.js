import express from "express";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.use("/api/addvehicle", vehicleRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});