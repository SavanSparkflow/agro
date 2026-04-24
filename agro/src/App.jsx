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
import RoleManagement from "./pages/admin/RoleManagement";
import UserPermissionManagement from "./pages/admin/UserPermissionManagement";
import Departments from "./pages/admin/Departments";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminUnits from "./pages/admin/Units";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Flow (Public only) */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />

        {/* Dashboard Flow (Requires Authentication) */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
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
          <Route path="admin/departments" element={<Departments />} />
          <Route path="admin/feedback" element={<FeedbackList />} />
          <Route path="admin/permissions" element={<RoleManagement />} />
          <Route path="admin/user-permissions" element={<UserPermissionManagement />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/units" element={<AdminUnits />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<div className="p-4 text-theme-muted">Reports Page (Coming Soon)</div>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
