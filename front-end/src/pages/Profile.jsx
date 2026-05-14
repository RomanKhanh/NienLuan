import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import styles from "./Profile.module.css";
import axios from "../util/axios.customize";
import { callUpdateProfileAPI, callChangePasswordAPI } from "../util/api";
import { notification } from "antd";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const user = auth.user || {};

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: user.avatar || null,
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
  const [errors, setErrors] = useState({});
  const [showPassSection, setShowPassSection] = useState(false);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      setForm((f) => ({ ...f, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập tên.";
    if (!form.email.trim()) errs.email = "Vui lòng nhập email.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Email không hợp lệ.";
    if (form.phone && !/^[0-9]{9,11}$/.test(form.phone))
      errs.phone = "Số điện thoại không hợp lệ.";
    if (showPassSection && form.newPassword) {
      if (form.newPassword.length < 8)
        errs.newPassword = "Mật khẩu phải có ít nhất 8 ký tự.";
      if (form.newPassword !== form.confirmPassword)
        errs.confirmPassword = "Mật khẩu xác nhận không khớp.";
      if (!form.currentPassword)
        errs.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      // Update profile info
      const res = await callUpdateProfileAPI({
        newName: form.name,
        newEmail: form.email,
        newPhone: form.phone,
        newAvatar: form.avatar,
      });

      if (showPassSection && form.newPassword) {
        // Update password
        await callChangePasswordAPI(form.currentPassword, form.newPassword);
      }

      setAuth((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: form.name,
          email: form.email,
          phone: form.phone,
          avatar: form.avatar,
        },
      }));
      localStorage.removeItem("access_token");
      localStorage.setItem("access_token", res.TOKEN);

      notification.success({ message: "Thay đổi thông tin thành công" });
    } catch (err) {
      console.error("Error updating profile:", err);
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          err.response?.data?.message ||
          "Đã có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.",
      });
    }
  };

  // Password strength
  const getStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = getStrength(form.newPassword);
  const strengthLabel = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"][strength];
  const strengthColor = ["", "#e05252", "#e8963a", "#5ba85a", "#2a7a3a"][
    strength
  ];

  return (
    <div className={styles.page}>
      {/* Decorative background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <i className="ti ti-arrow-left" /> Quay lại
        </button>

        {/* Card */}
        <div className={styles.card}>
          {/* Card header stripe */}
          <div className={styles.cardStripe} />

          <div className={styles.cardBody}>
            {/* Avatar */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarRing}>
                <div
                  className={styles.avatarCircle}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span className={styles.avatarInitials}>
                      {getInitials(form.name)}
                    </span>
                  )}
                  <div className={styles.avatarOverlay}>
                    <i className="ti ti-camera" />
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
              <div className={styles.avatarMeta}>
                <span className={styles.avatarName}>
                  {form.name || "Tên của bạn"}
                </span>
                <button
                  type="button"
                  className={styles.changeAvatarBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="ti ti-upload" /> Đổi ảnh
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} noValidate>
              {/* Section: Thông tin cá nhân */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <i className="ti ti-user" />
                  <span>Thông tin cá nhân</span>
                </div>
                <div className={styles.grid2}>
                  <Field
                    label="Họ và tên"
                    icon="ti-user-circle"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Nguyễn Văn A"
                    error={errors.name}
                    styles={styles}
                    disabled={user.loginType === "GOOGLE"}
                  />
                  <Field
                    label="Số điện thoại"
                    icon="ti-phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="0901 234 567"
                    error={errors.phone}
                    styles={styles}
                  />
                </div>
                <Field
                  label="Email"
                  icon="ti-mail"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="email@example.com"
                  error={errors.email}
                  styles={styles}
                  disabled={user.loginType === "GOOGLE"}
                />
              </div>

              {/* Section: Mật khẩu */}
              {/* Section: Mật khẩu — chỉ hiện nếu không phải Google */}
              {user.loginType !== "GOOGLE" && (
                <div className={styles.section}>
                  <button
                    type="button"
                    className={styles.sectionToggle}
                    onClick={() => setShowPassSection((v) => !v)}
                  >
                    <div className={styles.sectionHeader}>
                      <i className="ti ti-lock" />
                      <span>Đổi mật khẩu</span>
                    </div>
                    <i
                      className={`ti ${showPassSection ? "ti-chevron-up" : "ti-chevron-down"} ${styles.toggleIcon}`}
                    />
                  </button>

                  {showPassSection && (
                    <div className={styles.passFields}>
                      <Field
                        label="Mật khẩu hiện tại"
                        icon="ti-lock"
                        type="password"
                        value={form.currentPassword}
                        onChange={handleChange("currentPassword")}
                        placeholder="••••••••"
                        error={errors.currentPassword}
                        styles={styles}
                      />
                      <div className={styles.grid2}>
                        <div>
                          <Field
                            label="Mật khẩu mới"
                            icon="ti-lock-plus"
                            type="password"
                            value={form.newPassword}
                            onChange={handleChange("newPassword")}
                            placeholder="Tối thiểu 8 ký tự"
                            error={errors.newPassword}
                            styles={styles}
                          />
                          {form.newPassword && (
                            <div className={styles.strengthBar}>
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={styles.strengthSegment}
                                  style={{
                                    background:
                                      i <= strength ? strengthColor : "#e8d8be",
                                  }}
                                />
                              ))}
                              <span
                                className={styles.strengthLabel}
                                style={{ color: strengthColor }}
                              >
                                {strengthLabel}
                              </span>
                            </div>
                          )}
                        </div>
                        <Field
                          label="Xác nhận mật khẩu"
                          icon="ti-lock-check"
                          type="password"
                          value={form.confirmPassword}
                          onChange={handleChange("confirmPassword")}
                          placeholder="Nhập lại mật khẩu"
                          error={errors.confirmPassword}
                          styles={styles}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nếu là Google thì hiện badge thông báo */}
              {user.loginType === "GOOGLE" && (
                <div className={styles.googleNotice}>
                  <i className="ti ti-brand-google" />
                  <span>
                    Tài khoản đăng nhập qua Google — mật khẩu được quản lý bởi
                    Google
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => navigate(-1)}
                >
                  Huỷ
                </button>
                <button type="submit" className={styles.saveBtn}>
                  <i className="ti ti-device-floppy" /> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  styles,
  disabled,
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <div className={`${styles.inputWrap} ${error ? styles.inputError : ""}`}>
        <i className={`ti ${icon} ${styles.inputIcon}`} />
        <input
          className={styles.input}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
        />
      </div>
      {error && (
        <span className={styles.errorMsg}>
          <i className="ti ti-alert-circle" /> {error}
        </span>
      )}
    </div>
  );
}
