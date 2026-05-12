import React from "react";
import { Routes, Route } from "react-router-dom";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

const Search = () => (
  <div style={{ padding: "2rem" }}>Tìm kiếm (sắp ra mắt)</div>
);
const Favorite = () => (
  <div style={{ padding: "2rem" }}>Yêu thích (sắp ra mắt)</div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
