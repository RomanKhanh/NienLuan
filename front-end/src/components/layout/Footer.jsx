import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.logo}>Khám Phá Quán</span>

      <div className={styles.links}>
        <Link to="/about">Giới thiệu</Link>
        <Link to="/terms">Điều khoản</Link>
        <Link to="/privacy">Bảo mật</Link>
        <Link to="/support">Hỗ trợ</Link>
      </div>

      <span className={styles.copy}>© {new Date().getFullYear()} Khám Phá Quán</span>
    </footer>
  )
}
