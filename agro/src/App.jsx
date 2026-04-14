import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Stock from "./pages/Stock";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";
import Orders from "./pages/Orders";
import SalesHistory from "./pages/SalesHistory";
import Dealers from "./pages/admin/Dealers";
import Users from "./pages/admin/Users";
import FeedbackList from "./pages/admin/FeedbackList";
import RolePermissions from "./pages/admin/RolePermissions";
import Login from "./pages/auth/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Flow (Standalone) */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Flow (Requires Layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dealer" element={<Dashboard />} />
          <Route path="dealer/orders" element={<Orders />} />
          <Route path="dealer/customers" element={<Customers />} />
          <Route path="dealer/products" element={<Products />} />
          <Route path="dealer/categories" element={<Categories />} />
          <Route path="dealer/stock" element={<Stock />} />
          <Route path="dealer/billing" element={<Billing />} />
          <Route path="dealer/history" element={<SalesHistory />} />
          <Route path="dealer/feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin Flow */}
          <Route path="admin/dealers" element={<Dealers />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/feedback" element={<FeedbackList />} />
          <Route path="admin/permissions" element={<RolePermissions />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<div className="p-4 text-theme-muted">Reports Page (Coming Soon)</div>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
