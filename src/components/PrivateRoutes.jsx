import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  let auth = localStorage.getItem("token") ? true : false;
  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
