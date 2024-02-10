import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AddVehicle from "./pages/addVehicle/Addvechile";
import Details from "./pages/addVehicle/VehicleDetails";
import PrivateRoutes from "./components/PrivateRoutes";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/client" element={<AddVehicle />} />
          <Route path="/client/details/:id" element={<Details />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
