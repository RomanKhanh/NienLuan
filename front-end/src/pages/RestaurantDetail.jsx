import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import Comments from "../components/restaurant/Comments";
import styles from "./RestaurantDetail.module.css";

const MOCK_RESTAURANTS = {
  "quan-ba-cam": {
    id: "quan-ba-cam",
    category: "Ẩm thực Nam Bộ · Đặc sản Mekong",
    name: "Quán Bà Cẩm — Cơm Tấm & Lẩu Mắm",
    rating: 4.5,
    reviewCount: 328,
    isOpen: true,
    tags: ["Cơm tấm", "Lẩu mắm", "Bánh xèo", "Bún nước lèo"],
    description:
      "Quán ăn gia truyền hơn 30 năm tuổi, nổi tiếng với lẩu mắm nguyên chất và cơm tấm sườn nướng thơm lừng. Không gian mộc mạc, đậm chất miền Tây Nam Bộ, thu hút cả thực khách địa phương lẫn du khách.",
    address: "105 Trần Hưng Đạo, P. An Phú",
    addressSub: "Q. Ninh Kiều, Cần Thơ",
    hours: [
      { day: "CN (hôm nay)", time: "06:00 – 22:00", isToday: true },
      { day: "Thứ 2–6", time: "06:00 – 22:00", isToday: false },
      { day: "Thứ 7", time: "06:00 – 23:00", isToday: false },
    ],
    phone: "0292 381 2345",
    priceRange: "35.000 – 120.000 ₫ / người",
    amenities: "Đặt bàn · WiFi miễn phí · Chỗ đỗ xe",
    images: [],
  },
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = MOCK_RESTAURANTS[id] ?? MOCK_RESTAURANTS["quan-ba-cam"];

  if (!restaurant) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.notFound}>
          <p>Không tìm thấy quán ăn này.</p>
          <Link to="/">← Về trang chủ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Cần Thơ", to: "/search?city=cantho" },
    { label: "Ẩm thực Nam Bộ", to: "/search?category=nam-bo" },
    { label: restaurant.name, to: null },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/" className={styles.bcItem} aria-label="Trang chủ">
          🏠
        </Link>
        {breadcrumbs.map((bc, i) => (
          <React.Fragment key={i}>
            <span className={styles.bcSep}>›</span>
            {bc.to ? (
              <Link to={bc.to} className={styles.bcItem}>
                {bc.label}
              </Link>
            ) : (
              <span className={styles.bcCurrent}>{bc.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <main className={styles.main}>
        <div className={styles.infoWrap}>
          <RestaurantInfo restaurant={restaurant} />
        </div>
        <div className={styles.commentsWrap}>
          <Comments restaurantId={restaurant.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
