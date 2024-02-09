import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AddVehicle from "./pages/addVehicle/Addvechile";
import Details from "./pages/addVehicle/VehicleDetails";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/client" element={<AddVehicle />} />
        <Route path="/client/details/:id" element={<Details />} />
      </Routes>
    </>
  );
};

export default App;
