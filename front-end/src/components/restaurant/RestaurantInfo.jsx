import React, { useState } from 'react'
import styles from './RestaurantInfo.module.css'

export default function RestaurantInfo({ restaurant }) {
  const [saved, setSaved] = useState(false)

  const {
    category, name, rating, reviewCount, isOpen,
    tags = [], description, address, addressSub,
    hours = [], phone, priceRange, amenities, images = [],
  } = restaurant

  const fullStars  = Math.floor(rating)
  const halfStar   = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Đã sao chép đường dẫn!')
    }
  }

  return (
    <div className={styles.card}>

      {/* Gallery strip */}
      <div className={styles.gallery}>
        {images.length > 0
          ? images.slice(0, 3).map((src, i) => (
              <img key={i} src={src} alt={`${name} ${i + 1}`} className={styles.galleryImg} />
            ))
          : ['🍲', '🌿', '🫕'].map((emoji, i) => (
              <div key={i} className={`${styles.galleryPlaceholder} ${styles[`p${i + 1}`]}`}>
                {emoji}
              </div>
            ))}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p className={styles.category}>{category}</p>
        <h1 className={styles.name}>{name}</h1>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <div className={styles.stars} aria-label={`${rating} sao`}>
            {Array.from({ length: fullStars }).map((_, i)  => <Star key={`f${i}`} type="full" />)}
            {halfStar && <Star type="half" />}
            {Array.from({ length: emptyStars }).map((_, i) => <Star key={`e${i}`} type="empty" />)}
          </div>
          <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
          <span className={styles.reviewCount}>· {reviewCount.toLocaleString('vi-VN')} đánh giá</span>
          <span className={isOpen ? styles.badgeOpen : styles.badgeClosed}>
            {isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'}
          </span>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>

        {description && <p className={styles.desc}>{description}</p>}

        <hr className={styles.divider} />

        {/* Info list */}
        <div className={styles.infoList}>
          <InfoRow icon="📍" label="Địa chỉ">
            <span className={styles.infoValue}>{address}</span>
            {addressSub && <span className={styles.infoSub}>{addressSub}</span>}
          </InfoRow>

          <InfoRow icon="🕐" label="Giờ mở cửa">
            <div className={styles.hoursGrid}>
              {hours.map(h => (
                <React.Fragment key={h.day}>
                  <span className={h.isToday ? styles.hoursToday : styles.hoursDay}>{h.day}</span>
                  <span className={h.isToday ? styles.hoursToday : styles.hoursTime}>{h.time}</span>
                </React.Fragment>
              ))}
            </div>
          </InfoRow>

          <InfoRow icon="📞" label="Điện thoại">
            <a href={`tel:${phone}`} className={styles.infoValue}>{phone}</a>
          </InfoRow>

          <InfoRow icon="💵" label="Giá trung bình">
            <span className={styles.infoValue}>{priceRange}</span>
          </InfoRow>

          {amenities && (
            <InfoRow icon="✨" label="Tiện ích">
              <span className={styles.infoValue}>{amenities}</span>
            </InfoRow>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className={styles.actionBar}>
        <button
          className={`${styles.btnSave} ${saved ? styles.btnSaved : ''}`}
          onClick={() => setSaved(s => !s)}
          aria-pressed={saved}
        >
          {saved ? '♥ Đã lưu' : '♡ Lưu quán'}
        </button>
        <button className={styles.btnShare} onClick={handleShare} aria-label="Chia sẻ">
          ↗
        </button>
      </div>
    </div>
  )
}

function Star({ type }) {
  const map = { full: '★', half: '⯨', empty: '☆' }
  return <span className={type === 'empty' ? styles.starEmpty : styles.star}>{map[type]}</span>
}

function InfoRow({ icon, label, children }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon} aria-hidden="true">{icon}</div>
      <div className={styles.infoContent}>
        <p className={styles.infoLabel}>{label}</p>
        {children}
      </div>
    </div>
  )
}
