import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Auth from "./pages/Auth";
import { Toaster } from "react-hot-toast";
import Schedules from "./pages/Schedules";
import PrivateRoute from "./utils/PrivateRoute";
import Users from "./pages/Users";
import Customers from "./pages/Customers";
import Professionals from "./pages/Professionals";
import PageNotFound from "./utils/PageNotFound";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
      }}
    />
    <StrictMode>
      <Router>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Schedules />} />
            <Route path="/users" element={<Users />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/professionals" element={<Professionals />} />
          </Route>
        </Routes>
      </Router>
    </StrictMode>
  </>
);
