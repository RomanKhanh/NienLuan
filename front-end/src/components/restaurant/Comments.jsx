import React, { useState } from 'react'
import styles from './Comments.module.css'

// Mock comments data
const MOCK_COMMENTS = [
  {
    id: 1,
    avatar: '👩',
    name: 'Nguyễn Thị Lan',
    date: '2 ngày trước',
    rating: 5,
    text: 'Lẩu mắm ở đây ngon tuyệt vời! Nước lẩu đậm đà, nhiều rau sạch. Sẽ quay lại lần sau.',
  },
  {
    id: 2,
    avatar: '👨',
    name: 'Trần Văn Minh',
    date: '1 tuần trước',
    rating: 4,
    text: 'Cơm tấm sườn nướng thơm lắm, giá cả hợp lý. Quán hơi đông vào buổi trưa nhưng phục vụ nhanh.',
  },
  {
    id: 3,
    avatar: '👩',
    name: 'Lê Thị Hoa',
    date: '2 tuần trước',
    rating: 5,
    text: 'Không gian mộc mạc, ấm cúng. Bánh xèo giòn rụm, ăn cùng rau sống rất ngon. Highly recommend!',
  },
]

export default function Comments({ restaurantId }) {
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [newText, setNewText]   = useState('')
  const [newRating, setNewRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!newText.trim()) return
    setSubmitting(true)

    // TODO: thay bằng POST /api/comments
    setTimeout(() => {
      setComments(prev => [{
        id: Date.now(),
        avatar: '🧑',
        name: 'Bạn',
        date: 'Vừa xong',
        rating: newRating,
        text: newText.trim(),
      }, ...prev])
      setNewText('')
      setNewRating(5)
      setSubmitting(false)
    }, 400)
  }

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
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                className={`${styles.starBtn} ${s <= newRating ? styles.starActive : ''}`}
                onClick={() => setNewRating(s)}
                aria-label={`${s} sao`}
              >★</button>
            ))}
          </div>
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Chia sẻ trải nghiệm của bạn về quán..."
          value={newText}
          onChange={e => setNewText(e.target.value)}
          rows={3}
        />
        <button
          className={styles.btnSubmit}
          onClick={handleSubmit}
          disabled={!newText.trim() || submitting}
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </div>

      <hr className={styles.divider} />

      {/* Danh sách comments */}
      <div className={styles.list}>
        {comments.map(c => (
          <div key={c.id} className={styles.item}>
            <div className={styles.itemAvatar}>{c.avatar}</div>
            <div className={styles.itemBody}>
              <div className={styles.itemTop}>
                <span className={styles.itemName}>{c.name}</span>
                <span className={styles.itemDate}>{c.date}</span>
              </div>
              <div className={styles.itemStars}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={s <= c.rating ? styles.starFull : styles.starEmpty}>★</span>
                ))}
              </div>
              <p className={styles.itemText}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
