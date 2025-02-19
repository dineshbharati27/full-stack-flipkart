import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./LoginSignup";

import ShowProduct from "./ShowProduct";
import TrendingProducts from "./TrendingProducts";
import Navbar from "./Navbar";
import CartPage from "./CartPage";
import PlaceOrder from "./PlaceOrder";
import OrdersPage from "./OrdersPage";
import MyProfile from "./MyProfile";
import WishlistPage from "./WishListPage";
import Category from "./category";
import Footer from "./Footer";

const AppRouter = () => {
  return (
    <Router>
    <Navbar/>
    <Routes>
      {/* <Route path="/trendingProducts" element={<TrendingProducts />} /> */}
      <Route path="/" element={<Category />} />
      <Route path="/product" element={<ShowProduct />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/placeOrder/:productId" element={<PlaceOrder/>}/>
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      
    </Routes>
   
  </Router>
  )
}

export default AppRouter
