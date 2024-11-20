import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function PrivateRoute(): JSX.Element {
  const authData = localStorage.getItem("authData");
  return authData ? (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/auth" />
  );
}
