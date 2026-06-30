import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "./StaticPage.module.css";

const faqs = [
  {
    q: "Làm sao để đăng một bài chia sẻ quán ăn mới?",
    a: "Sau khi đăng nhập, bạn vào trang chủ và chọn nút đăng bài, thêm hình ảnh, mô tả và vị trí quán ăn rồi gửi bài. Bài viết sẽ hiển thị ngay trên bảng tin.",
  },
  {
    q: "Tôi quên mật khẩu thì phải làm sao?",
    a: 'Tại trang đăng nhập, chọn mục "Quên mật khẩu" và làm theo hướng dẫn để đặt lại mật khẩu mới qua email đã đăng ký.',
  },
  {
    q: "Làm sao để lưu quán ăn vào mục yêu thích?",
    a: "Bấm vào biểu tượng bookmark trên bài đăng hoặc trang chi tiết quán ăn, quán sẽ được thêm vào mục Yêu thích trong trang cá nhân của bạn.",
  },
  {
    q: "Tôi muốn báo cáo một bài đăng vi phạm thì làm thế nào?",
    a: "Bạn có thể liên hệ với chúng tôi qua email hoặc hotline bên dưới kèm theo đường dẫn bài đăng để được xử lý nhanh chóng.",
  },
  {
    q: "Làm sao để xoá tài khoản của tôi?",
    a: "Vui lòng gửi yêu cầu qua email hỗ trợ, đội ngũ của chúng tôi sẽ xác nhận và xử lý yêu cầu xoá tài khoản trong vòng 48 giờ.",
  },
];

export default function Support() {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <i className="ti ti-headset" aria-hidden="true" />
          </div>
          <h1 className={styles.heroTitle}>Trung tâm hỗ trợ</h1>
          <p className={styles.heroSubtitle}>
            Có thắc mắc cần giải đáp? Chúng tôi luôn sẵn sàng giúp đỡ bạn.
          </p>
        </div>

        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Kênh liên hệ</h2>
              <div className={styles.contactGrid}>
                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}>
                    <i className="ti ti-mail" aria-hidden="true" />
                  </div>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>
                    support@khamphaquan.vn
                  </div>
                </div>
                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}>
                    <i className="ti ti-phone" aria-hidden="true" />
                  </div>
                  <div className={styles.contactLabel}>Hotline</div>
                  <div className={styles.contactValue}>1900 6868</div>
                </div>
                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}>
                    <i className="ti ti-clock-hour-9" aria-hidden="true" />
                  </div>
                  <div className={styles.contactLabel}>Thời gian</div>
                  <div className={styles.contactValue}>
                    8:00 - 21:00 hằng ngày
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
              <div>
                {faqs.map((f) => (
                  <div className={styles.faqItem} key={f.q}>
                    <div className={styles.faqQ}>
                      <i className="ti ti-help-circle" aria-hidden="true" />
                      {f.q}
                    </div>
                    <div className={styles.faqA}>{f.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
