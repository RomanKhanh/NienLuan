import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./auth.context";
import axios from "../util/axios.customize";

export const SocketContext = createContext(null);

export const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
};

export const SocketWrapper = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!auth.isAuthenticated) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/notifications");
      if (res.EC === 0) {
        setNotifications(res.NOTIFICATIONS);
      }
    } catch (e) {
      console.error("Fetch notifications error:", e);
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user?._id) return;

    fetchNotifications();

    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current.emit("join", auth.user._id);

    socketRef.current.on("new_notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [auth.isAuthenticated, auth.user?._id]);

  const markAllRead = useCallback(async () => {
    try {
      await axios.patch("/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteAllNotifications = useCallback(async () => {
    try {
      await axios.delete("/api/notifications");
      setNotifications([]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAllRead,
        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
