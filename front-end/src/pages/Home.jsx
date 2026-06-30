import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PostCard from "../components/post/PostCard";
import PostDialog from "../components/post/PostDialog";

import styles from "./Home.module.css";

import { AuthContext } from "../context/auth.context";
import { callFetchPostsAPI } from "../util/api";
import { Avatar } from "antd";

const FILTERS = [
  { key: "so-sao", icon: "ti-star", label: "Số sao" },
  { key: "moi-nhat", icon: "ti-clock", label: "Mới nhất", defaultActive: true },
  { key: "pho-bien", icon: "ti-heart", label: "Phổ biến" },
];

const PAGE_SIZE = 3;

const CATEGORY_OPTIONS = [
  "Nhà hàng Nhật",
  "Nhà hàng Hàn quốc",
  "Nhà hàng Âu",
  "Cơm tấm",
  "Phở",
  "Bún bò",
  "Bánh xèo",
  "Hủ tiếu",
  "Lẩu",
  "Hải sản",
  "Đồ nướng",
  "Chay",
  "Cà phê & Tráng miệng",
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  console.log("Auth state in Home:", { auth });
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilters, setActiveFilters] = useState(["moi-nhat"]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPosts = async (keyword = search, category = selectedCategory) => {
    try {
      setLoading(true);
      const res = await callFetchPostsAPI(keyword, category);
      if (res?.EC === 0) {
        const formattedPosts = res.POSTS.map((p) => ({
          id: p._id,

          restaurantId: p.restaurantId?._id,

          restaurantName: p.restaurantId?.name || "Unknown Restaurant",

          description: p.description,

          address: p.restaurantId?.address || "No address",

          restaurantRating: p.restaurantRating || p.restaurantId?.rating || 0,

          likeCount: p.likeCount || 0,

          isLiked: p.isLiked || false,

          comments: p.commentCount || 0,

          image: p.images?.[0] || "",

          imgBg: "#eee",

          emoji: "🍜",

          createdAt: p.createdAt,
          time: new Date(p.createdAt).toLocaleDateString(),

          poster: {
            name: p.userId?.name || "Unknown User",

            avatar: p.userId?.avatar,

            initials:
              p.userId?.name
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2) || "U",

            bg: "#ff6b6b",
          },
        }));

        setPosts(formattedPosts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleFilter = (key) => {
    setActiveFilters((prev) => {
      if (prev.includes(key)) {
        return ["moi-nhat"];
      }
      return [key];
    });
    setPage(1);
  };

  const sortedPosts = [...posts];
  const activeSort = activeFilters[0] || "moi-nhat";

  if (activeSort === "so-sao") {
    sortedPosts.sort(
      (a, b) => (b.restaurantRating || 0) - (a.restaurantRating || 0),
    );
  } else if (activeSort === "pho-bien") {
    sortedPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  } else {
    sortedPosts.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  }

  const filtered = sortedPosts;

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoading(false);
    }, 600);
  };

  const handleSearch = (keyword = search, category = selectedCategory) => {
    setPage(1);
    fetchPosts(keyword, category);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    fetchPosts(search, category);
  };

  const handlePostSubmit = () => {
    fetchPosts(search, selectedCategory);
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
              placeholder="Tìm tên quán ăn..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch(search, selectedCategory);
                }
              }}
            />
          </div>
          <div className={styles.heroFilterSelectWrap}>
            <select
              className={styles.heroFilterSelect}
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Tất cả loại</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            className={styles.heroSearchBtn}
            onClick={() => handleSearch(search, selectedCategory)}
          >
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
        {auth.isAuthenticated && (
          <button
            className={styles.btnNewPost}
            onClick={() => setDialogOpen(true)}
          >
            <i className="ti ti-pencil-plus" aria-hidden="true" />
            Đăng bài mới
          </button>
        )}
      </div>

      {/* ── FEED ── */}
      <main className={styles.feed}>
        {!auth.isAuthenticated ? (
          <div className={styles.empty}>
            <i className="ti ti-search-off" aria-hidden="true" />
            <p>Bạn cần đăng nhập để xem các bài post</p>
          </div>
        ) : visible.length === 0 ? (
          <div className={styles.empty}>
            <i className="ti ti-search-off" aria-hidden="true" />
            <p>Không tìm thấy quán ăn nào phù hợp</p>
          </div>
        ) : (
          <>
            {visible.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDetail={() => navigate(`/post/${post.id}`)}
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
                      <i className="ti ti-refresh" aria-hidden="true" />
                      Tải thêm bài đăng
                    </>
                  )}
                </button>
              </div>
            )}
          </>
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
