import React, { useState } from "react";
import styles from "./PostCard.module.css";

export default function PostCard({ post, onDetail }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLiked((l) => !l);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  const fullStars = Math.floor(post.rating);
  const emptyStars = 5 - fullStars;

  return (
    <article className={styles.card}>
      {/* Header: avatar + tên + thời gian */}
      <div className={styles.header}>
        <div className={styles.avatar} style={{ background: post.poster.bg }}>
          {post.poster.initials}
        </div>
        <div className={styles.posterInfo}>
          <span className={styles.posterName}>{post.poster.name}</span>
          <span className={styles.time}>
            <i className="ti ti-clock" aria-hidden="true" /> {post.time}
          </span>
        </div>
        <button className={styles.menuBtn} aria-label="Tùy chọn">
          <i className="ti ti-dots" aria-hidden="true" />
        </button>
      </div>

      {/* Tên quán + địa điểm + sao */}
      <div className={styles.meta}>
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
        </div>
      </div>

      {/* Ảnh */}
      <div
        className={styles.img}
        style={{ background: post.imgBg }}
        role="img"
        aria-label={`Ảnh ${post.restaurantName}`}
      >
        {post.image ? (
          <img
            src={post.image}
            alt={post.restaurantName}
            className={styles.imgReal}
          />
        ) : (
          <span className={styles.imgEmoji}>{post.emoji}</span>
        )}
      </div>

      {/* Footer: actions + nút xem chi tiết */}
      <div className={styles.footer}>
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${liked ? styles.liked : ""}`}
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? "Bỏ thích" : "Thích"}
          >
            <i className="ti ti-heart" aria-hidden="true" /> {likes}
          </button>
          <button className={styles.actionBtn} aria-label="Bình luận">
            <i className="ti ti-message-circle" aria-hidden="true" />{" "}
            {post.comments}
          </button>
          <button
            className={styles.actionBtn}
            aria-label="Chia sẻ"
            onClick={() => {
              if (navigator.share)
                navigator.share({
                  title: post.restaurantName,
                  url: window.location.href,
                });
              else {
                navigator.clipboard.writeText(window.location.href);
                alert("Đã sao chép đường dẫn!");
              }
            }}
          >
            <i className="ti ti-share" aria-hidden="true" /> Chia sẻ
          </button>
        </div>
        <button className={styles.btnDetail} onClick={onDetail}>
          Xem chi tiết <i className="ti ti-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
