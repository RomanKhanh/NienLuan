import React, { useState, useEffect } from "react";
import styles from "./Comments.module.css";
import { notification } from "antd";
import { callCreateCommentAPI, callFetchCommentsAPI } from "../../util/api";

export default function Comments({ restaurantId }) {
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await callFetchCommentsAPI(restaurantId);
      console.log(res);
      if (res.EC === 0) {
        setComments(res.COMMENTS);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!newText.trim()) return;
      setSubmitting(true);

      const res = await callCreateCommentAPI(restaurantId, newText, newRating);
      if (res.EC !== 0) {
        notification.error({
          message: "Tạo bình luận thất bại",
          description: "Đã có lỗi xảy ra, vui lòng thử lại",
        });
        return;
      }

      fetchComments();

      setNewText("");
      setNewRating(5);
      setSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Đánh giá & Bình luận</h2>
        <span className={styles.count}>{comments.length} bình luận</span>
      </div>

      {/* Form thêm comment */}
      <div className={styles.form}>
        <div className={styles.formRating}>
          <span className={styles.formLabel}>Đánh giá của bạn:</span>
          <div className={styles.starPicker}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                className={`${styles.starBtn} ${s <= newRating ? styles.starActive : ""}`}
                onClick={() => setNewRating(s)}
                aria-label={`${s} sao`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Chia sẻ trải nghiệm của bạn về quán..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={3}
        />
        <button
          className={styles.btnSubmit}
          onClick={handleSubmit}
          disabled={!newText.trim() || submitting}
        >
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>

      <hr className={styles.divider} />

      {/* Danh sách comments */}
      <div className={styles.list}>
        {comments.map((c) => (
          <div key={c._id} className={styles.item}>
            <div className={styles.itemAvatar}>{c.userId.avatar}</div>
            <div className={styles.itemBody}>
              <div className={styles.itemTop}>
                <span className={styles.itemName}>{c.userId.name}</span>
                <span className={styles.itemDate}>
                  {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className={styles.itemStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={
                      s <= c.rating ? styles.starFull : styles.starEmpty
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className={styles.itemText}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
