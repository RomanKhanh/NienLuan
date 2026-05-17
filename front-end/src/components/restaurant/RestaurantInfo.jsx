import React, { useState } from "react";
import styles from "./RestaurantInfo.module.css";

export default function RestaurantInfo({ restaurant }) {
  const [saved, setSaved] = useState(false);

  const {
    category,
    name,
    rating = 0,
    reviewCount = 0,
    isOpen,
    tags = [],
    description,
    address,
    addressSub,
    hours = [],
    phone,
    priceRange,
    amenities,
    images = [],
  } = restaurant;

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const amenityList =
    typeof amenities === "string"
      ? amenities
          .split(/[·,]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={styles.card}>
      {/* Gallery */}
      <div className={styles.gallery}>
        {images.length > 0 ? (
          <>
            <img src={images[0]} alt={name} className={styles.galleryMain} />
            <div className={styles.gallerySide}>
              {images.slice(1, 3).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${name} ${i + 2}`}
                  className={styles.gallerySub}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={`${styles.galleryMain} ${styles.placeholderMain}`}>
              🍜
            </div>
            <div className={styles.gallerySide}>
              <div className={`${styles.gallerySub} ${styles.placeholderSub}`}>
                🌿
              </div>
              <div className={`${styles.gallerySub} ${styles.placeholderSub}`}>
                🫕
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.body}>
        {/* Header */}
        <div className={styles.header}>
          {category && <p className={styles.category}>{category}</p>}
          <h1 className={styles.name}>{name}</h1>

          <div className={styles.ratingRow}>
            <div className={styles.stars} aria-label={`${rating} sao`}>
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={`f${i}`} type="full" />
              ))}
              {halfStar && <Star type="half" />}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={`e${i}`} type="empty" />
              ))}
            </div>
            <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>
              · {reviewCount.toLocaleString("vi-VN")} đánh giá
            </span>
            <span className={isOpen ? styles.badgeOpen : styles.badgeClosed}>
              {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
            </span>
          </div>

          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {description && <p className={styles.desc}>{description}</p>}
        </div>

        {/* Action bar */}
        <div className={styles.actionBar}>
          <button
            className={`${styles.btnSave} ${saved ? styles.btnSaved : ""}`}
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
          >
            <i
              className={saved ? "ti ti-heart-filled" : "ti ti-heart"}
              aria-hidden="true"
            />
            {saved ? "Đã lưu" : "Lưu quán"}
          </button>
          {phone && (
            <a href={`tel:${phone}`} className={styles.btnCall}>
              <i className="ti ti-phone" aria-hidden="true" />
              Gọi ngay
            </a>
          )}
          <button
            className={styles.btnShare}
            onClick={handleShare}
            aria-label="Chia sẻ"
          >
            <i className="ti ti-share" aria-hidden="true" />
          </button>
        </div>

        <hr className={styles.divider} />

        {/* Info list */}
        <div className={styles.infoList}>
          {(address || addressSub) && (
            <InfoRow icon="ti-map-pin" label="Địa chỉ">
              {address && <span className={styles.infoVal}>{address}</span>}
              {addressSub && (
                <span className={styles.infoSub}>{addressSub}</span>
              )}
            </InfoRow>
          )}

          {hours.length > 0 && (
            <InfoRow icon="ti-clock" label="Giờ mở cửa">
              <div className={styles.hoursGrid}>
                {hours.map((h) => (
                  <React.Fragment key={h.day}>
                    <span
                      className={
                        h.isToday ? styles.hoursToday : styles.hoursDay
                      }
                    >
                      {h.day}
                    </span>
                    <span
                      className={
                        h.isToday ? styles.hoursToday : styles.hoursTime
                      }
                    >
                      {h.time}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </InfoRow>
          )}

          {phone && (
            <InfoRow icon="ti-phone" label="Điện thoại">
              <a href={`tel:${phone}`} className={styles.infoLink}>
                {phone}
              </a>
            </InfoRow>
          )}

          {priceRange && (
            <InfoRow icon="ti-currency-dong" label="Giá trung bình">
              <span className={styles.infoVal}>{priceRange}</span>
            </InfoRow>
          )}

          {amenityList.length > 0 && (
            <InfoRow icon="ti-sparkles" label="Tiện ích">
              <div className={styles.amenityList}>
                {amenityList.map((a) => (
                  <span key={a} className={styles.amenity}>
                    {a}
                  </span>
                ))}
              </div>
            </InfoRow>
          )}
        </div>
      </div>
    </div>
  );
}

function Star({ type }) {
  const map = { full: "★", half: "⯨", empty: "☆" };
  return (
    <span className={type === "empty" ? styles.starEmpty : styles.star}>
      {map[type]}
    </span>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon} aria-hidden="true">
        <i className={`ti ${icon}`} />
      </div>
      <div className={styles.infoContent}>
        <p className={styles.infoLabel}>{label}</p>
        {children}
      </div>
    </div>
  );
}
