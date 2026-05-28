import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "./Favorites.module.css";
import {
  callGetFavoritePostsAPI,
  callRemoveFavoritePostAPI,
} from "../util/api";

const SORT_OPTIONS = [
  { key: "newest", icon: "ti-clock", label: "Mới nhất" },
  { key: "top-rated", icon: "ti-star", label: "Sao cao nhất" },
  { key: "category", icon: "ti-tools-kitchen-2", label: "Loại món" },
];

export default function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [sortKey, setSortKey] = useState("newest");
  const [confirmClear, setConfirmClear] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const fetchFavorites = async () => {
    try {
      const res = await callGetFavoritePostsAPI();

      if (res.EC === 0) {
        setFavorites(res.FAVORITES);
      }
    } catch (error) {
      console.error("Error fetching favorite posts:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const sorted = [...favorites].sort((a, b) => {
    if (sortKey === "top-rated") {
      return (b.restaurantId?.rating || 0) - (a.restaurantId?.rating || 0);
    }

    if (sortKey === "category") {
      return (a.restaurantId?.category || "").localeCompare(
        b.restaurantId?.category || "",
      );
    }

    return 0;
  });

  const handleUnlike = async (id) => {
    try {
      setRemovingId(id);

      const res = await callRemoveFavoritePostAPI(id);

      if (res.EC === 0) {
        setFavorites((prev) => prev.filter((f) => f._id !== id));
      } else {
        console.error("Error removing favorite post:", res.EM);

        setRemovingId(null);
      }
    } catch (error) {
      console.error("Error removing favorite post:", error);

      setRemovingId(null);
    }
  };

  const handleClearAll = () => {
    setConfirmClear(false);
    setFavorites([]);
  };

  const uniqueRestaurants = new Set(favorites.map((f) => f.restaurantId?._id))
    .size;

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>
            <i className="ti ti-heart" />
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
        </div>
      </div>

      {favorites.length > 0 && (
        <div className={styles.sortBar}>
          <div className={styles.sortRow}>
            <span className={styles.sortLbl}>Sắp xếp:</span>

            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                className={`${styles.chip} ${
                  sortKey === opt.key ? styles.chipActive : ""
                }`}
                onClick={() => setSortKey(opt.key)}
              >
                <i className={`ti ${opt.icon}`} />
                {opt.label}
              </button>
            ))}
          </div>

          {!confirmClear ? (
            <button
              className={styles.btnClear}
              onClick={() => setConfirmClear(true)}
            >
              <i className="ti ti-heart-off" />
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

      <main className={styles.feed}>
        {favorites.length === 0 && (
          <div className={styles.empty}>
            <i className="ti ti-heart-off" />

            <p className={styles.emptyTitle}>Chưa có bài đăng yêu thích</p>

            <p className={styles.emptySub}>
              Hãy khám phá và thả tim những quán ăn bạn thích!
            </p>

            <button className={styles.btnExplore} onClick={() => navigate("/")}>
              <i className="ti ti-compass" />
              Khám phá ngay
            </button>
          </div>
        )}

        {sorted.map((post) => (
          <FavoriteCard
            key={post._id}
            post={post}
            removing={removingId === post._id}
            onUnlike={() => handleUnlike(post._id)}
            onDetail={() => navigate(`/post/${post._id}`)}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}

function FavoriteCard({ post, removing, onUnlike, onDetail }) {
  const restaurant = post?.restaurantId || {};
  const user = post?.userId || {};

  const rating = post?.restaurantRating || restaurant?.rating || 0;

  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  const poster = {
    name: user?.name || "Anonymous",
    initials: user?.name?.charAt(0)?.toUpperCase(),
    bg: "#ffb347",
  };

  return (
    <article
      className={`${styles.card} ${removing ? styles.cardRemoving : ""}`}
    >
      <div className={styles.cardHeader}>
        <div className={styles.avatar} style={{ background: poster.bg }}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={styles.avatarImg}
            />
          ) : (
            poster.initials
          )}
        </div>

        <div className={styles.posterInfo}>
          <span className={styles.posterName}>{poster.name}</span>

          <span className={styles.postTime}>
            <i className="ti ti-clock" />
            {post?.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>

      <div className={styles.cardMeta}>
        <h2 className={styles.restName}>{restaurant?.name || "N/A"}</h2>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <i className="ti ti-map-pin" />
            {restaurant?.address || ""}
          </span>

          <span className={styles.metaItem}>
            <span className={styles.stars} aria-label={`${rating} sao`}>
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

            <span className={styles.ratingVal}>{rating.toFixed(1)}</span>
          </span>

          <span className={styles.categoryBadge}>
            {restaurant?.category || ""}
          </span>
        </div>
      </div>

      <div className={styles.cardImg}>
        {restaurant?.images?.[0] ? (
          <img
            src={restaurant.images[0]}
            alt={restaurant?.name}
            className={styles.image}
          />
        ) : (
          <span className={styles.imgEmoji}>🍔</span>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.actions}>
          <span className={styles.actionItem}>
            <i className="ti ti-heart" />
            {post?.likeCount || 0}
          </span>

          <span className={styles.actionItem}>
            <i className="ti ti-message-circle" />
            {post?.commentCount || 0}
          </span>
        </div>

        <div className={styles.btnGroup}>
          <button className={styles.btnUnlike} onClick={onUnlike}>
            <i className="ti ti-heart-off" />
            Bỏ thích
          </button>

          <button className={styles.btnDetail} onClick={onDetail}>
            Xem chi tiết
            <i className="ti ti-arrow-right" />
          </button>
        </div>
      </div>
    </article>
  );
}
