import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "./StaticPage.module.css";

const sections = [
  {
    title: "Chấp nhận điều khoản",
    text: "Khi truy cập và sử dụng Khám Phá Quán, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Nếu không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ.",
  },
  {
    title: "Tài khoản người dùng",
    list: [
      "Bạn cần cung cấp thông tin chính xác khi đăng ký tài khoản.",
      "Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động diễn ra trên tài khoản của mình.",
      "Mỗi người chỉ được tạo một tài khoản cá nhân, trừ trường hợp được cho phép riêng.",
    ],
  },
  {
    title: "Quy tắc nội dung",
    text: "Khi đăng bài, đánh giá hoặc bình luận, bạn cam kết:",
    list: [
      "Không đăng tải nội dung sai sự thật, xúc phạm, phân biệt đối xử hoặc vi phạm pháp luật.",
      "Không spam, quảng cáo trái phép hoặc giả mạo đánh giá.",
      "Tôn trọng quyền sở hữu trí tuệ của người khác khi chia sẻ hình ảnh, bài viết.",
    ],
  },
  {
    title: "Quyền sở hữu nội dung",
    text: "Nội dung do bạn đăng tải vẫn thuộc quyền sở hữu của bạn. Tuy nhiên, bằng việc đăng tải lên nền tảng, bạn cấp cho Khám Phá Quán quyền sử dụng, hiển thị và phân phối nội dung đó trong phạm vi hoạt động của dịch vụ.",
  },
  {
    title: "Hành vi bị nghiêm cấm",
    list: [
      "Sử dụng dịch vụ cho mục đích bất hợp pháp hoặc gây hại cho người khác.",
      "Cố tình can thiệp, phá hoại hệ thống hoặc thu thập dữ liệu trái phép.",
      "Mạo danh cá nhân, tổ chức khác để gây hiểu nhầm cho cộng đồng.",
    ],
  },
  {
    title: "Tạm ngừng & chấm dứt tài khoản",
    text: "Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản vi phạm điều khoản sử dụng mà không cần báo trước, nhằm bảo vệ trải nghiệm chung của cộng đồng.",
  },
  {
    title: "Thay đổi điều khoản",
    text: "Điều khoản này có thể được cập nhật theo thời gian. Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.",
  },
  {
    title: "Liên hệ",
    text: "Nếu có bất kỳ thắc mắc nào về điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua trang Hỗ trợ.",
  },
];

export default function Terms() {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <i className="ti ti-file-text" aria-hidden="true" />
          </div>
          <h1 className={styles.heroTitle}>Điều khoản sử dụng</h1>
          <p className={styles.heroSubtitle}>
            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng Khám Phá
            Quán.
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
