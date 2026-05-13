import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { AuthContext } from "../../context/auth.context";
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    user: "Trần Thị Lan",
    userInitials: "TL",
    userBg: "#F5E6C8",
    message: "đã thả tim bài đăng của bạn",
    target: "Quán Bà Cẩm — Cơm Tấm & Lẩu Mắm",
    time: "2 phút trước",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: "Minh Hoàng",
    userInitials: "MH",
    userBg: "#E8C98A",
    message: "đã bình luận vào bài đăng của bạn",
    target: "Bánh Xèo Mười Xiềm",
    time: "15 phút trước",
    read: false,
  },
  {
    id: 3,
    type: "like",
    user: "Ngọc Anh",
    userInitials: "NA",
    userBg: "#F0D4A0",
    message: "đã thả tim bài đăng của bạn",
    target: "Bún Bò Huế Dì Năm",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: 4,
    type: "comment",
    user: "Văn Khoa",
    userInitials: "VK",
    userBg: "#F5E0B5",
    message: "đã bình luận vào bài đăng của bạn",
    target: "Quán Bà Cẩm — Cơm Tấm & Lẩu Mắm",
    time: "3 giờ trước",
    read: true,
  },
  {
    id: 5,
    type: "like",
    user: "Phương Thảo",
    userInitials: "PT",
    userBg: "#E8C98A",
    message: "đã thả tim bài đăng của bạn",
    target: "Hủ Tiếu Nam Vang Tư Ký",
    time: "5 giờ trước",
    read: true,
  },
];

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const { auth } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen((o) => !o);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const deleteNotification = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoDot} />
        Khám Phá Quán
      </Link>

      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Khám phá
        </Link>
        <Link to="/search" className={styles.navLink}>
          Gần tôi
        </Link>
        <Link to="/favorites" className={styles.navLink}>
          Yêu thích
        </Link>
        <Link to="/search" className={styles.navLink}>
          Đánh giá
        </Link>
      </nav>

      <div className={styles.rightGroup}>
        {/* Notification bell */}
        <div className={styles.notiWrap} ref={dropdownRef}>
          <button
            className={styles.bellBtn}
            onClick={handleOpen}
            aria-label={`Thông báo${unreadCount > 0 ? `, ${unreadCount} chưa đọc` : ""}`}
            aria-expanded={open}
          >
            <i className="ti ti-bell" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className={styles.badge}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className={styles.dropdown}>
              <div className={styles.dropHeader}>
                <span className={styles.dropTitle}>Thông báo</span>
                {unreadCount > 0 && (
                  <button className={styles.markAllBtn} onClick={markAllRead}>
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
              </div>

              <div className={styles.dropList}>
                {notifications.length === 0 && (
                  <div className={styles.emptyNoti}>
                    <i className="ti ti-bell-off" aria-hidden="true" />
                    <span>Không có thông báo nào</span>
                  </div>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`${styles.notiItem} ${!n.read ? styles.notiUnread : ""}`}
                    onClick={() => markRead(n.id)}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <span className={styles.unreadDot} aria-hidden="true" />
                    )}

                    {/* Avatar */}
                    <div
                      className={styles.notiAvatar}
                      style={{ background: n.userBg }}
                    >
                      {n.userInitials}
                    </div>

                    {/* Icon type */}
                    <div
                      className={`${styles.notiTypeIcon} ${n.type === "like" ? styles.iconLike : styles.iconComment}`}
                    >
                      <i
                        className={`ti ${n.type === "like" ? "ti-heart" : "ti-message-circle"}`}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Content */}
                    <div className={styles.notiContent}>
                      <p className={styles.notiText}>
                        <strong>{n.user}</strong> {n.message}
                      </p>
                      <p className={styles.notiTarget}>{n.target}</p>
                      <span className={styles.notiTime}>
                        <i className="ti ti-clock" aria-hidden="true" />{" "}
                        {n.time}
                      </span>
                    </div>

                    {/* Delete */}
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => deleteNotification(e, n.id)}
                      aria-label="Xóa thông báo"
                    >
                      <i className="ti ti-x" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              {notifications.length > 0 && (
                <div className={styles.dropFooter}>
                  <button
                    className={styles.clearAllBtn}
                    onClick={() => setNotifications([])}
                  >
                    <i className="ti ti-trash" aria-hidden="true" />
                    Xóa tất cả thông báo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auth buttons */}
        {auth.isAuthenticated ? (
          <div className={styles.userMenu}>
            <span className={styles.userName}>{auth.user.name}</span>
            {/* Future: Add dropdown menu for profile, settings, logout */}
          </div>
        ) : (
          <>
            <button
              className={styles.btnLogin}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
            <button
              className={styles.btnPrimary}
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </>
        )}
      </div>
    </header>
  );
}
