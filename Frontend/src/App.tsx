import React from 'react';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Homepage from './UserPages/Homepage';
import Shop from './UserPages/Shop';
import New from './UserPages/New';
import About from './UserPages/About';
import Cart from './UserPages/Cart';

const App = () => {
  return <div>
    <BrowserRouter>
    <Routes>

      <Route path="/" element={<Homepage />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/new" element={<New />} />
      <Route path="/about" element={<About />} /> 
      <Route path="/cart" element={<Cart />} />
    </Routes>
    </BrowserRouter>
    </div>;
};

export default App;