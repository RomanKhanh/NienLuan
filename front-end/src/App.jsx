import React from "react";
import { Spin } from "antd";
import { Routes, Route } from "react-router-dom";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/auth.context";
import axios from "./util/axios.customize";

const Search = () => (
  <div style={{ padding: "2rem" }}>Tìm kiếm (sắp ra mắt)</div>
);
const Favorite = () => (
  <div style={{ padding: "2rem" }}>Yêu thích (sắp ra mắt)</div>
);

export default function App() {
  const { setAuth, setLoading, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoading(true);
      const res = await axios.get("/api/account");
      console.log("Account info:", res);
      if (res?.email) {
        setAuth({
          isAuthenticated: true,
          user: {
            name: res.name,
            email: res.email,
            phone: res.phone,
          },
        });
      }
      setLoading(false);
    };
    fetchAccountInfo();
  }, []);

  return loading ? (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Spin size="large" />
    </div>
  ) : (
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
