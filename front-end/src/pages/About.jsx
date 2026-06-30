import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "./StaticPage.module.css";

export default function About() {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <i className="ti ti-tools-kitchen-2" aria-hidden="true" />
          </div>
          <h1 className={styles.heroTitle}>Về Khám Phá Quán</h1>
          <p className={styles.heroSubtitle}>
            Nền tảng giúp bạn tìm và chia sẻ những quán ăn ngon, không gian đẹp
            ở khắp mọi nơi — bởi chính những người yêu ẩm thực.
          </p>
        </div>

        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Quán ăn được chia sẻ</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Người dùng hoạt động</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>200K+</div>
                <div className={styles.statLabel}>Đánh giá & bình luận</div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>1</span>
                Câu chuyện của chúng tôi
              </h2>
              <div className={styles.sectionText}>
                <p>
                  Khám Phá Quán ra đời từ một câu hỏi rất đơn giản: "Hôm nay ăn
                  gì, ở đâu?". Chúng tôi nhận ra rằng giữa hàng ngàn lựa chọn,
                  điều mọi người tin tưởng nhất vẫn là trải nghiệm thật từ những
                  thực khách đã từng ghé qua.
                </p>
                <p>
                  Vì vậy, chúng tôi xây dựng một cộng đồng nơi mọi người có thể
                  tự do chia sẻ những quán ăn yêu thích, để lại đánh giá chân
                  thực và giúp nhau khám phá những địa điểm ẩm thực thú vị mà có
                  thể bạn chưa từng biết tới.
                </p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>2</span>
                Sứ mệnh
              </h2>
              <div className={styles.sectionText}>
                <p>
                  Kết nối những người yêu ẩm thực với những quán ăn chất lượng,
                  đồng thời tạo cơ hội cho các quán ăn nhỏ, mới mở được nhiều
                  người biết đến hơn thông qua những đánh giá trung thực từ cộng
                  đồng.
                </p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>3</span>
                Giá trị cốt lõi
              </h2>
              <div className={styles.valueGrid}>
                <div className={styles.valueItem}>
                  <div className={styles.valueIcon}>
                    <i className="ti ti-heart-handshake" aria-hidden="true" />
                  </div>
                  <div>
                    <div className={styles.valueTitle}>Trung thực</div>
                    <div className={styles.valueDesc}>
                      Mọi đánh giá đều đến từ trải nghiệm thật, không quảng cáo
                      trá hình.
                    </div>
                  </div>
                </div>
                <div className={styles.valueItem}>
                  <div className={styles.valueIcon}>
                    <i className="ti ti-users" aria-hidden="true" />
                  </div>
                  <div>
                    <div className={styles.valueTitle}>Cộng đồng</div>
                    <div className={styles.valueDesc}>
                      Phát triển dựa trên sự đóng góp và kết nối giữa các thành
                      viên.
                    </div>
                  </div>
                </div>
                <div className={styles.valueItem}>
                  <div className={styles.valueIcon}>
                    <i className="ti ti-bulb" aria-hidden="true" />
                  </div>
                  <div>
                    <div className={styles.valueTitle}>Sáng tạo</div>
                    <div className={styles.valueDesc}>
                      Không ngừng cải tiến trải nghiệm tìm kiếm và khám phá quán
                      ăn.
                    </div>
                  </div>
                </div>
                <div className={styles.valueItem}>
                  <div className={styles.valueIcon}>
                    <i className="ti ti-shield-check" aria-hidden="true" />
                  </div>
                  <div>
                    <div className={styles.valueTitle}>Minh bạch</div>
                    <div className={styles.valueDesc}>
                      Bảo vệ quyền lợi và thông tin của người dùng là ưu tiên
                      hàng đầu.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
