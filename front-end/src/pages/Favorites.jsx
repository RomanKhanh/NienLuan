import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "./Favorites.module.css";

const MOCK_FAVORITES = [
  {
    id: 1,
    restaurantId: "quan-ba-cam",
    poster: { initials: "TL", name: "Trần Thị Lan", bg: "#F5E6C8" },
    time: "2 giờ trước",
    likedAt: "10/05/2026",
    restaurantName: "Quán Bà Cẩm — Cơm Tấm & Lẩu Mắm",
    address: "105 Trần Hưng Đạo, Ninh Kiều, Cần Thơ",
    category: "Ẩm thực Nam Bộ",
    rating: 5,
    likes: 128,
    comments: 34,
    emoji: "🍲",
    imgBg: "linear-gradient(135deg,#F5E0B5,#E8C98A)",
  },
  {
    id: 2,
    restaurantId: "bun-bo-di-nam",
    poster: { initials: "MH", name: "Minh Hoàng", bg: "#E8C98A" },
    time: "5 giờ trước",
    likedAt: "09/05/2026",
    restaurantName: "Bún Bò Huế Dì Năm",
    address: "23 Nguyễn Trãi, Bình Thủy, Cần Thơ",
    category: "Bún - Phở",
    rating: 4,
    likes: 87,
    comments: 21,
    emoji: "🍜",
    imgBg: "linear-gradient(135deg,#F0D4A0,#FAC775)",
  },
  {
    id: 3,
    restaurantId: "banh-xeo-muoi-xiem",
    poster: { initials: "NA", name: "Ngọc Anh", bg: "#F0D4A0" },
    time: "1 ngày trước",
    likedAt: "08/05/2026",
    restaurantName: "Bánh Xèo Mười Xiềm",
    address: "78 Lý Tự Trọng, Ninh Kiều, Cần Thơ",
    category: "Ẩm thực Nam Bộ",
    rating: 5,
    likes: 214,
    comments: 56,
    emoji: "🥘",
    imgBg: "linear-gradient(135deg,#E8C98A,#D4943A)",
  },
  {
    id: 4,
    restaurantId: "hu-tieu-tu-ky",
    poster: { initials: "VK", name: "Văn Khoa", bg: "#F5E0B5" },
    time: "2 ngày trước",
    likedAt: "07/05/2026",
    restaurantName: "Hủ Tiếu Nam Vang Tư Ký",
    address: "12 Đinh Tiên Hoàng, Ninh Kiều, Cần Thơ",
    category: "Hủ Tiếu",
    rating: 4,
    likes: 63,
    comments: 18,
    emoji: "🍝",
    imgBg: "linear-gradient(135deg,#FAC775,#D4943A)",
  },
  {
    id: 5,
    restaurantId: "lau-thai-saigon",
    poster: { initials: "PT", name: "Phương Thảo", bg: "#E8C98A" },
    time: "3 ngày trước",
    likedAt: "06/05/2026",
    restaurantName: "Lẩu Thái Saigon Garden",
    address: "56 Trần Phú, Cái Răng, Cần Thơ",
    category: "Lẩu",
    rating: 5,
    likes: 189,
    comments: 42,
    emoji: "🫕",
    imgBg: "linear-gradient(135deg,#F5E0B5,#B5731A)",
  },
];

const SORT_OPTIONS = [
  { key: "newest", icon: "ti-clock", label: "Mới nhất" },
  { key: "top-rated", icon: "ti-star", label: "Sao cao nhất" },
  { key: "category", icon: "ti-tools-kitchen-2", label: "Loại món" },
];

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);
  const [sortKey, setSortKey] = useState("newest");
  const [confirmClear, setConfirmClear] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const sorted = [...favorites].sort((a, b) => {
    if (sortKey === "top-rated") return b.rating - a.rating;
    if (sortKey === "category") return a.category.localeCompare(b.category);
    return 0; // newest — giữ nguyên thứ tự mock
  });

  const handleUnlike = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      setRemovingId(null);
    }, 320);
  };

  const handleClearAll = () => {
    setConfirmClear(false);
    setFavorites([]);
  };

  const uniqueRestaurants = new Set(favorites.map((f) => f.restaurantId)).size;

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* ── PAGE HEADER ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>
            <i className="ti ti-heart" aria-hidden="true" />
            Bài đăng yêu thích
          </h1>
          <p className={styles.pageSub}>
            Những quán ăn bạn đã lưu lại để ghé thăm
          </p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statChip}>
            <span className={styles.statNum}>{favorites.length}</span>
            <span className={styles.statLbl}>Bài đăng</span>
          </div>
          <div className={styles.statChip}>
            <span className={styles.statNum}>{uniqueRestaurants}</span>
            <span className={styles.statLbl}>Quán ăn</span>
          </div>
        </div>
      </div>

      {/* ── SORT BAR ── */}
      {favorites.length > 0 && (
        <div className={styles.sortBar}>
          <div className={styles.sortRow}>
            <span className={styles.sortLbl}>Sắp xếp:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                className={`${styles.chip} ${sortKey === opt.key ? styles.chipActive : ""}`}
                onClick={() => setSortKey(opt.key)}
              >
                <i className={`ti ${opt.icon}`} aria-hidden="true" />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Nút xóa tất cả */}
          {!confirmClear ? (
            <button
              className={styles.btnClear}
              onClick={() => setConfirmClear(true)}
            >
              <i className="ti ti-heart-off" aria-hidden="true" />
              Xóa tất cả
            </button>
          ) : (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>Xóa hết?</span>
              <button className={styles.btnConfirmYes} onClick={handleClearAll}>
                Có
              </button>
              <button
                className={styles.btnConfirmNo}
                onClick={() => setConfirmClear(false)}
              >
                Không
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── FEED ── */}
      <main className={styles.feed}>
        {/* Empty state */}
        {favorites.length === 0 && (
          <div className={styles.empty}>
            <i className="ti ti-heart-off" aria-hidden="true" />
            <p className={styles.emptyTitle}>Chưa có bài đăng yêu thích</p>
            <p className={styles.emptySub}>
              Hãy khám phá và thả tim những quán ăn bạn thích!
            </p>
            <button className={styles.btnExplore} onClick={() => navigate("/")}>
              <i className="ti ti-compass" aria-hidden="true" />
              Khám phá ngay
            </button>
          </div>
        )}

        {sorted.map((post) => (
          <FavoriteCard
            key={post.id}
            post={post}
            removing={removingId === post.id}
            onUnlike={() => handleUnlike(post.id)}
            onDetail={() => navigate(`/restaurant/${post.restaurantId}`)}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}

// ── Favorite Card ──
function FavoriteCard({ post, removing, onUnlike, onDetail }) {
  const fullStars = Math.floor(post.rating);
  const emptyStars = 5 - fullStars;

  return (
    <article
      className={`${styles.card} ${removing ? styles.cardRemoving : ""}`}
    >
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.avatar} style={{ background: post.poster.bg }}>
          {post.poster.initials}
        </div>
        <div className={styles.posterInfo}>
          <span className={styles.posterName}>{post.poster.name}</span>
          <span className={styles.postTime}>
            <i className="ti ti-clock" aria-hidden="true" /> {post.time}
          </span>
        </div>
        <div className={styles.likedBadge}>
          <i className="ti ti-heart" aria-hidden="true" />
          Đã thích {post.likedAt}
        </div>
      </div>

      {/* Meta */}
      <div className={styles.cardMeta}>
        <h2 className={styles.restName}>{post.restaurantName}</h2>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <i className="ti ti-map-pin" aria-hidden="true" />
            {post.address}
          </span>
          <span className={styles.metaItem}>
            <span className={styles.stars} aria-label={`${post.rating} sao`}>
              {Array.from({ length: fullStars }).map((_, i) => (
                <span key={`f${i}`} className={styles.starF}>
                  ★
                </span>
              ))}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <span key={`e${i}`} className={styles.starE}>
                  ★
                </span>
              ))}
            </span>
            <span className={styles.ratingVal}>{post.rating.toFixed(1)}</span>
          </span>
          <span className={styles.categoryBadge}>{post.category}</span>
        </div>
      </div>

      {/* Ảnh */}
      <div
        className={styles.cardImg}
        style={{ background: post.imgBg }}
        role="img"
        aria-label={`Ảnh ${post.restaurantName}`}
      >
        <span className={styles.imgEmoji}>{post.emoji}</span>
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.actions}>
          <span className={styles.actionItem}>
            <i className="ti ti-heart" aria-hidden="true" /> {post.likes}
          </span>
          <span className={styles.actionItem}>
            <i className="ti ti-message-circle" aria-hidden="true" />{" "}
            {post.comments}
          </span>
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btnUnlike} onClick={onUnlike}>
            <i className="ti ti-heart-off" aria-hidden="true" />
            Bỏ thích
          </button>
          <button className={styles.btnDetail} onClick={onDetail}>
            Xem chi tiết <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
