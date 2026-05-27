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
  { key: "loai-mon", icon: "ti-tools-kitchen-2", label: "Loại món" },
  { key: "khu-vuc", icon: "ti-map-pin", label: "Khu vực" },
  { key: "so-sao", icon: "ti-star", label: "Số sao" },
  { key: "moi-nhat", icon: "ti-clock", label: "Mới nhất", defaultActive: true },
  { key: "pho-bien", icon: "ti-heart", label: "Phổ biến" },
];

const PAGE_SIZE = 3;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  console.log("Auth state in Home:", { auth });
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState(["moi-nhat"]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await callFetchPostsAPI();
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
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const filtered = posts.filter((p) => {
    const restaurantName = p.restaurantId?.name?.toLowerCase() || "";
    const address = p.restaurantId?.address?.toLowerCase() || "";
    const keyword = search.toLowerCase();

    return restaurantName.includes(keyword) || address.includes(keyword);
  });

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoading(false);
    }, 600);
  };

  const handlePostSubmit = () => {
    fetchPosts();
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
