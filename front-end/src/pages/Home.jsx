import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PostCard from "../components/post/PostCard";
import PostDialog from "../components/post/PostDialog";

import styles from "./Home.module.css";

import { AuthContext } from "../context/auth.context";

const MOCK_POSTS = [
  {
    id: 1,
    restaurantId: "quan-ba-cam",
    poster: { initials: "TL", name: "Trần Thị Lan", bg: "#F5E6C8" },
    time: "2 giờ trước",
    restaurantName: "Quán Bà Cẩm — Cơm Tấm & Lẩu Mắm",
    address: "105 Trần Hưng Đạo, Ninh Kiều, Cần Thơ",
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
    restaurantName: "Bún Bò Huế Dì Năm",
    address: "23 Nguyễn Trãi, Bình Thủy, Cần Thơ",
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
    restaurantName: "Bánh Xèo Mười Xiềm",
    address: "78 Lý Tự Trọng, Ninh Kiều, Cần Thơ",
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
    restaurantName: "Hủ Tiếu Nam Vang Tư Ký",
    address: "12 Đinh Tiên Hoàng, Ninh Kiều, Cần Thơ",
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
    restaurantName: "Lẩu Thái Saigon Garden",
    address: "56 Trần Phú, Cái Răng, Cần Thơ",
    rating: 5,
    likes: 189,
    comments: 42,
    emoji: "🫕",
    imgBg: "linear-gradient(135deg,#F5E0B5,#B5731A)",
  },
];

const FILTERS = [
  { key: "loai-mon", icon: "ti-tools-kitchen-2", label: "Loại món" },
  { key: "khu-vuc", icon: "ti-map-pin", label: "Khu vực" },
  { key: "so-sao", icon: "ti-star", label: "Số sao" },
  { key: "moi-nhat", icon: "ti-clock", label: "Mới nhất", defaultActive: true },
  { key: "pho-bien", icon: "ti-heart", label: "Phổ biến" },
];

const PAGE_SIZE = 3;

export default function Home() {
  const { isAuthenticated, auth, setAuth } = useContext(AuthContext);
  console.log("Auth state in Home:", { auth });
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState(["moi-nhat"]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const filtered = MOCK_POSTS.filter(
    (p) =>
      p.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()),
  );

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoading(false);
    }, 600);
  };

  const handlePostSubmit = (data) => {
    // TODO: POST /api/posts — thêm bài mới vào feed
    console.log("New post:", data);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />

        <h1 className={styles.heroTitle}>
          Khám phá <em className={styles.heroEm}>ẩm thực</em>
          <br />
          miền Tây Nam Bộ
        </h1>
        <p className={styles.heroSub}>
          Hàng nghìn quán ăn ngon được chia sẻ bởi cộng đồng yêu ẩm thực
        </p>

        {/* Thanh search trong hero */}
        <div className={styles.heroSearch}>
          <div className={styles.heroSearchWrap}>
            <i className="ti ti-search" aria-hidden="true" />
            <input
              className={styles.heroSearchInp}
              type="text"
              placeholder="Tìm tên quán, món ăn, địa điểm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button className={styles.heroSearchBtn}>
            <i className="ti ti-search" aria-hidden="true" />
            Tìm kiếm
          </button>
        </div>
      </section>

      {/* ── POST BAR + FILTER ── */}
      <div className={styles.postBar}>
        <div className={styles.filterRow}>
          <span className={styles.filterLbl}>
            <i className="ti ti-adjustments-horizontal" aria-hidden="true" />{" "}
            Lọc:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.chip} ${activeFilters.includes(f.key) ? styles.chipActive : ""}`}
              onClick={() => toggleFilter(f.key)}
            >
              <i className={`ti ${f.icon}`} aria-hidden="true" />
              {f.label}
            </button>
          ))}
        </div>

        <button
          className={styles.btnNewPost}
          onClick={() => setDialogOpen(true)}
        >
          <i className="ti ti-pencil-plus" aria-hidden="true" />
          Đăng bài mới
        </button>
      </div>

      {/* ── FEED ── */}
      <main className={styles.feed}>
        {visible.length === 0 && (
          <div className={styles.empty}>
            <i className="ti ti-search-off" aria-hidden="true" />
            <p>Không tìm thấy quán ăn nào phù hợp</p>
          </div>
        )}

        {visible.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDetail={() => navigate(`/restaurant/${post.restaurantId}`)}
          />
        ))}

        {hasMore && (
          <div className={styles.loadMore}>
            <button
              className={styles.btnLoad}
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} /> Đang tải...
                </>
              ) : (
                <>
                  <i className="ti ti-refresh" aria-hidden="true" /> Tải thêm
                  bài đăng
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* ── DIALOG ĐĂNG BÀI ── */}
      <PostDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
}
