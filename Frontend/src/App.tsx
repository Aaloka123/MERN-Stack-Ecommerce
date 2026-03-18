import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./UserPages/Homepage";
import Shop from "./UserPages/Shop";
import New from "./UserPages/New";
import About from "./UserPages/About";
import Cart from "./UserPages/Cart";
import Login from "./Logins&Signup/Login";
import Signup from "./Logins&Signup/Signup";
import Profile from "./UserPages/Profile";
import AdminDashboard from "./AdminPages/AdminDashboard";
import AdminProduct from "./AdminPages/AdminProduct";
import AdminSetting from "./AdminPages/AdminSetting";
import AdminUser from "./AdminPages/AdminUser";
import AdminOrder from "./AdminPages/AdminOrder";
import Productdetail from "./UserPages/Productdetail";
import MyOrders from "./UserPages/MyOrders";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  if (typeof window === "undefined") return children;
  const currentUser = sessionStorage.getItem("currentUser");
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  if (typeof window === "undefined") return children;
  const role = sessionStorage.getItem("ROLE") || "user";
  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/new" element={<New />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <Cart />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RequireAuth>
                <MyOrders />
              </RequireAuth>
            }
          />
          <Route path="/productdetail/:id" element={<Productdetail />} />

          {/* login and signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* admin (protected) */}
          <Route
            path="/admindashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/adminproducts"
            element={
              <RequireAdmin>
                <AdminProduct />
              </RequireAdmin>
            }
          />
          <Route
            path="/adminsettings"
            element={
              <RequireAdmin>
                <AdminSetting />
              </RequireAdmin>
            }
          />
          <Route
            path="/adminusers"
            element={
              <RequireAdmin>
                <AdminUser />
              </RequireAdmin>
            }
          />
          <Route
            path="/adminorders"
            element={
              <RequireAdmin>
                <AdminOrder />
              </RequireAdmin>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;