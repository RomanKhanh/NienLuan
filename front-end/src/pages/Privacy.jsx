import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "./StaticPage.module.css";

const sections = [
  {
    title: "Thông tin chúng tôi thu thập",
    text: "Để cung cấp dịch vụ tốt nhất, chúng tôi có thể thu thập các loại thông tin sau:",
    list: [
      "Thông tin tài khoản: họ tên, email, số điện thoại, ảnh đại diện.",
      "Nội dung bạn tạo: bài đăng, đánh giá, bình luận, ảnh quán ăn.",
      "Dữ liệu sử dụng: lượt thích, lưu bài, lịch sử tìm kiếm trên nền tảng.",
      "Thông tin thiết bị: loại trình duyệt, địa chỉ IP, vị trí gần đúng (nếu được cho phép).",
    ],
  },
  {
    title: "Mục đích sử dụng thông tin",
    list: [
      "Cá nhân hoá trải nghiệm gợi ý quán ăn phù hợp với bạn.",
      "Hiển thị thông báo về tương tác như lượt thích, bình luận.",
      "Bảo trì, cải thiện chất lượng và bảo mật của hệ thống.",
      "Liên hệ hỗ trợ khi cần thiết.",
    ],
  },
  {
    title: "Chia sẻ thông tin",
    text: "Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ trong các trường hợp: có sự đồng ý của bạn, theo yêu cầu pháp luật, hoặc với các đối tác kỹ thuật hỗ trợ vận hành nền tảng (lưu trữ, gửi thông báo) với cam kết bảo mật tương đương.",
  },
  {
    title: "Bảo mật dữ liệu",
    text: "Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp như mã hoá mật khẩu, kiểm soát truy cập để bảo vệ thông tin của bạn khỏi truy cập, sử dụng hoặc tiết lộ trái phép. Tuy nhiên, không có phương thức truyền tải nào trên Internet là an toàn tuyệt đối.",
  },
  {
    title: "Quyền của bạn",
    list: [
      "Truy cập và chỉnh sửa thông tin cá nhân trong phần Hồ sơ.",
      "Yêu cầu xoá tài khoản và dữ liệu liên quan.",
      "Từ chối nhận thông báo, email không cần thiết.",
    ],
  },
  {
    title: "Cookie",
    text: "Chúng tôi sử dụng cookie để ghi nhớ phiên đăng nhập và cải thiện trải nghiệm duyệt web. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy điều này có thể ảnh hưởng đến một số chức năng.",
  },
  {
    title: "Thay đổi chính sách",
    text: "Chính sách bảo mật có thể được cập nhật để phù hợp với thay đổi của dịch vụ hoặc quy định pháp luật. Mọi thay đổi quan trọng sẽ được thông báo trên nền tảng.",
  },
  {
    title: "Liên hệ",
    text: "Nếu bạn có câu hỏi về cách chúng tôi xử lý dữ liệu cá nhân, vui lòng liên hệ qua trang Hỗ trợ.",
  },
];

export default function Privacy() {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <i className="ti ti-shield-lock" aria-hidden="true" />
          </div>
          <h1 className={styles.heroTitle}>Chính sách bảo mật</h1>
          <p className={styles.heroSubtitle}>
            Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ thông
            tin cá nhân một cách tốt nhất.
          </p>
        </div>

        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.updated}>Cập nhật lần cuối: 30/06/2026</p>

            {sections.map((s, i) => (
              <React.Fragment key={s.title}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionNumber}>{i + 1}</span>
                    {s.title}
                  </h2>
                  <div className={styles.sectionText}>
                    {s.text && <p>{s.text}</p>}
                    {s.list && (
                      <ul>
                        {s.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {i < sections.length - 1 && <div className={styles.divider} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
