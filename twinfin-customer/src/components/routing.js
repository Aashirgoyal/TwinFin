import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Home from "./Home.js";
import Login from "./login.js";
import Register from "./register.js";
import Dashboard from "../pages/dashboard.js";
import Transactions from "../pages/transactions.js";
import Budgets from "../pages/budgets.js";
import Goals from "../pages/goals.js";
import Profile from "../pages/profile.js";

function Protected({ children }) {
  const { customer } = useAuth();
  return customer ? children : <Navigate to="/login" replace />;
}

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
      <Route path="/budgets" element={<Protected><Budgets /></Protected>} />
      <Route path="/goals" element={<Protected><Goals /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Routing;
