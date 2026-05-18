import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import Comments from "../components/restaurant/Comments";
import styles from "./RestaurantDetail.module.css";
import { callFetchRestaurantAPI } from "../util/api";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const fetchRestaurant = async () => {
    try {
      const res = await callFetchRestaurantAPI(id);
      if (res.EC === 0) {
        setRestaurant(res.RESTAURANT);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

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
          <Comments restaurantId={restaurant._id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
