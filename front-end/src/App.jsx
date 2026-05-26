import React from "react";
import { Spin } from "antd";
import { Routes, Route } from "react-router-dom";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
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
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await axios.get("/api/account");
        console.log(res);

        if (res?.USER?.email) {
          setAuth({
            isAuthenticated: true,
            user: {
              name: res.USER.name,
              email: res.USER.email,
              phone: res.USER.phone,
              avatar: res.USER.avatar,
              loginType: res.USER.loginType,
            },
          });
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/post/:postId" element={<RestaurantDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
