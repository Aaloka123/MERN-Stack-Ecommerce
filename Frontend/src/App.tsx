import React from 'react';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Homepage from './UserPages/Homepage';
import Shop from './UserPages/Shop';
import New from './UserPages/New';
import About from './UserPages/About';
import Cart from './UserPages/Cart';
import Login from './Logins&Signup/Login';
import Signup from './Logins&Signup/Signup';
import Profile from './UserPages/Profile';
import AdminDashboard from './AdminPages/AdminDashboard';
import AdminProduct from './AdminPages/AdminProduct';
import AdminSetting from './AdminPages/AdminSetting';
import AdminUser from './AdminPages/AdminUser';
import AdminOrder from './AdminPages/AdminOrder';

const App = () => {
  return <div>
    <BrowserRouter>
    <Routes>

      <Route path="/" element={<Homepage />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/new" element={<New />} />
      <Route path="/about" element={<About />} /> 
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* login and signup */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* admin */}
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/adminproducts" element={<AdminProduct />} />
      <Route path="/adminsettings" element={<AdminSetting />} />
      <Route path="/adminusers" element={<AdminUser />} />
      <Route path="/adminorders" element={<AdminOrder />} />

    </Routes>
    </BrowserRouter>
    </div>;
};

export default App;