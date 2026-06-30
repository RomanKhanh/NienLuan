import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { AuthContext } from "../../context/auth.context";
import { SocketContext, timeAgo } from "../../context/socket.context";

export default function Header() {
  const navigate = useNavigate();
  const [notiOpen, setNotiOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
  } = useContext(SocketContext);

  const notiRef = useRef(null);
  const avatarRef = useRef(null);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target))
        setNotiOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target))
        setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setAvatarOpen(false);
    localStorage.removeItem("access_token");
    setAuth({ isAuthenticated: false, user: null });
    navigate("/login");
  };

  const handleViewProfile = () => {
    setAvatarOpen(false);
    navigate("/profile");
  };

  // Lấy icon và text label theo type
  const getTypeInfo = (type) => {
    if (type === "like")
      return {
        icon: "ti-heart",
        cls: styles.iconLike,
        label: "đã thả tim bài đăng của bạn",
      };
    if (type === "favorite")
      return {
        icon: "ti-bookmark",
        cls: styles.iconFavorite,
        label: "đã lưu bài đăng của bạn",
      };
    return {
      icon: "ti-message-circle",
      cls: styles.iconComment,
      label: "đã bình luận vào bài đăng của bạn",
    };
  };

  // Lấy initials + màu nền từ tên
  const colorPalette = [
    "#F5E6C8",
    "#E8C98A",
    "#F0D4A0",
    "#F5E0B5",
    "#E8D4B5",
    "#F2DEC0",
  ];
  const getAvatarBg = (name = "") =>
    colorPalette[name.charCodeAt(0) % colorPalette.length];

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
        <Link to="/favorites" className={styles.navLink}>
          Yêu thích
        </Link>
      </nav>

      <div className={styles.rightGroup}>
        {auth.isAuthenticated ? (
          <>
            {/* Chuông thông báo */}
            <div className={styles.notiWrap} ref={notiRef}>
              <button
                className={styles.bellBtn}
                onClick={() => {
                  setNotiOpen((o) => !o);
                  setAvatarOpen(false);
                }}
                aria-label={`Thông báo${unreadCount > 0 ? `, ${unreadCount} chưa đọc` : ""}`}
                aria-expanded={notiOpen}
              >
                <i className="ti ti-bell" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className={styles.badge}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notiOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropHeader}>
                    <span className={styles.dropTitle}>Thông báo</span>
                    {unreadCount > 0 && (
                      <button
                        className={styles.markAllBtn}
                        onClick={markAllRead}
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>

                  <div className={styles.dropList}>
                    {loading && (
                      <div className={styles.emptyNoti}>
                        <span>Đang tải...</span>
                      </div>
                    )}

                    {!loading && notifications.length === 0 && (
                      <div className={styles.emptyNoti}>
                        <i className="ti ti-bell-off" aria-hidden="true" />
                        <span>Không có thông báo nào</span>
                      </div>
                    )}

                    {!loading &&
                      notifications.map((n) => {
                        const sender = n.senderId;
                        const senderName = sender?.name || "Ai đó";
                        const { icon, cls, label } = getTypeInfo(n.type);
                        const postTitle = n.postId?.description
                          ? n.postId.description.slice(0, 40) +
                            (n.postId.description.length > 40 ? "..." : "")
                          : "bài đăng";

                        return (
                          <div
                            key={n._id}
                            className={`${styles.notiItem} ${!n.isRead ? styles.notiUnread : ""}`}
                          >
                            {!n.isRead && (
                              <span
                                className={styles.unreadDot}
                                aria-hidden="true"
                              />
                            )}
                            <div
                              className={styles.notiAvatar}
                              style={{ background: getAvatarBg(senderName) }}
                            >
                              {sender?.avatar ? (
                                <img
                                  src={sender.avatar}
                                  alt={senderName}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                getInitials(senderName)
                              )}
                            </div>
                            <div className={`${styles.notiTypeIcon} ${cls}`}>
                              <i className={`ti ${icon}`} aria-hidden="true" />
                            </div>
                            <div className={styles.notiContent}>
                              <p className={styles.notiText}>
                                <strong>{senderName}</strong> {label}
                              </p>
                              <p className={styles.notiTarget}>{postTitle}</p>
                              <span className={styles.notiTime}>
                                <i className="ti ti-clock" aria-hidden="true" />{" "}
                                {timeAgo(n.createdAt)}
                              </span>
                            </div>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => deleteNotification(n._id)}
                              aria-label="Xóa thông báo"
                            >
                              <i className="ti ti-x" aria-hidden="true" />
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  {notifications.length > 0 && (
                    <div className={styles.dropFooter}>
                      <button
                        className={styles.clearAllBtn}
                        onClick={deleteAllNotifications}
                      >
                        <i className="ti ti-trash" aria-hidden="true" />
                        Xóa tất cả thông báo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Avatar + dropdown */}
            <div className={styles.avatarWrap} ref={avatarRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => {
                  setAvatarOpen((o) => !o);
                  setNotiOpen(false);
                }}
                aria-label="Tài khoản"
                aria-expanded={avatarOpen}
              >
                {auth.user?.avatar ? (
                  <img
                    src={auth.user.avatar}
                    alt={auth.user.name}
                    className={styles.avatarImg}
                  />
                ) : (
                  <span className={styles.avatarFallback}>
                    {getInitials(auth.user?.name)}
                  </span>
                )}
                <i
                  className={`ti ti-chevron-down ${styles.avatarChevron} ${avatarOpen ? styles.avatarChevronOpen : ""}`}
                  aria-hidden="true"
                />
              </button>

              {avatarOpen && (
                <div className={styles.avatarDropdown}>
                  <div className={styles.avatarDropHeader}>
                    <div className={styles.avatarDropAvatar}>
                      {auth.user?.avatar ? (
                        <img
                          src={auth.user.avatar}
                          alt={auth.user.name}
                          className={styles.avatarDropImg}
                        />
                      ) : (
                        <span className={styles.avatarDropFallback}>
                          {getInitials(auth.user?.name)}
                        </span>
                      )}
                    </div>
                    <div className={styles.avatarDropInfo}>
                      <span className={styles.avatarDropName}>
                        {auth.user?.name}
                      </span>
                      <span className={styles.avatarDropEmail}>
                        {auth.user?.email}
                      </span>
                    </div>
                  </div>
                  <div className={styles.avatarDropDivider} />
                  <button
                    className={styles.avatarDropItem}
                    onClick={handleViewProfile}
                  >
                    <i className="ti ti-user-circle" aria-hidden="true" />
                    Thông tin tài khoản
                  </button>
                  <div className={styles.avatarDropDivider} />
                  <button
                    className={`${styles.avatarDropItem} ${styles.avatarDropLogout}`}
                    onClick={handleLogout}
                  >
                    <i className="ti ti-logout" aria-hidden="true" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
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
