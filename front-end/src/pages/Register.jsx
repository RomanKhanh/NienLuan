import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { callRegisterAPI, callFindUserByEmailAPI } from "../util/api";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = async () => {
    const errs = {};
    const res = await callFindUserByEmailAPI(form.email);
    if (res.EC === 0) errs.email = "Email đã được sử dụng.";
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Email không hợp lệ.";
    if (!form.phone.match(/^0\d{9}$/))
      errs.phone = "Số điện thoại không hợp lệ.";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (form.password.length < 8) errs.password = "Mật khẩu ít nhất 8 ký tự.";
    if (form.password !== form.confirm)
      errs.confirm = "Mật khẩu xác nhận không khớp.";
    if (!form.agree) errs.agree = "Bạn cần đồng ý điều khoản.";
    return errs;
  };

  const handleNext = async () => {
    const errs = await validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    callRegisterAPI(form.name, form.email, form.phone, form.password)
      .then(() => {
        setLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Registration error:", error);
      });
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Yếu", "Trung bình", "Khá", "Mạnh"][strength];
  const strengthColor = ["", "#E24B4A", "#EF9F27", "#D4943A", "#3B6D11"][
    strength
  ];

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.card}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot} />
          Khám Phá Quán
        </Link>

        <h1 className={styles.title}>Tạo tài khoản</h1>
        <p className={styles.subtitle}>
          Tham gia cùng hàng nghìn người yêu ẩm thực
        </p>

        {/* Step indicator */}
        <div className={styles.steps}>
          <div
            className={`${styles.step} ${step >= 1 ? styles.stepActive : ""}`}
          >
            <div className={styles.stepDot}>
              {step > 1 ? (
                <i className="ti ti-check" aria-hidden="true" />
              ) : (
                "1"
              )}
            </div>
            <span>Thông tin</span>
          </div>
          <div
            className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : ""}`}
          />
          <div
            className={`${styles.step} ${step >= 2 ? styles.stepActive : ""}`}
          >
            <div className={styles.stepDot}>2</div>
            <span>Bảo mật</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className={styles.form}>
            <Field
              label="Họ và tên"
              icon="ti-user"
              name="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              label="Email"
              icon="ti-mail"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              label="Số điện thoại"
              icon="ti-phone"
              name="phone"
              type="tel"
              placeholder="0912 345 678"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <button
              type="button"
              className={styles.btnSubmit}
              onClick={handleNext}
            >
              Tiếp theo
              <i className="ti ti-arrow-right" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Password */}
            <div className={styles.field}>
              <label className={styles.label}>Mật khẩu</label>
              <div className={styles.inputWrap}>
                <i className="ti ti-lock" aria-hidden="true" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Ít nhất 8 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <i
                    className={`ti ${showPass ? "ti-eye-off" : "ti-eye"}`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBar}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={styles.strengthSeg}
                        style={{
                          background: i <= strength ? strengthColor : undefined,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className={styles.strengthLabel}
                    style={{ color: strengthColor }}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className={styles.errorMsg}>{errors.password}</span>
              )}
            </div>

            {/* Confirm password */}
            <div className={styles.field}>
              <label className={styles.label}>Xác nhận mật khẩu</label>
              <div className={styles.inputWrap}>
                <i className="ti ti-lock-check" aria-hidden="true" />
                <input
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirm}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.confirm ? styles.inputError : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? "Ẩn" : "Hiện"}
                >
                  <i
                    className={`ti ${showConfirm ? "ti-eye-off" : "ti-eye"}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {errors.confirm && (
                <span className={styles.errorMsg}>{errors.confirm}</span>
              )}
            </div>

            {/* Agree */}
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span>
                Tôi đồng ý với{" "}
                <Link to="/terms" className={styles.link}>
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className={styles.link}>
                  Chính sách bảo mật
                </Link>
              </span>
            </label>
            {errors.agree && (
              <span className={styles.errorMsg}>{errors.agree}</span>
            )}

            <div className={styles.btnRow}>
              <button
                type="button"
                className={styles.btnBack}
                onClick={() => setStep(1)}
              >
                <i className="ti ti-arrow-left" aria-hidden="true" />
                Quay lại
              </button>
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    Đăng ký <i className="ti ti-check" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className={styles.dividerRow}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>hoặc</span>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.socialGroup}>
          <button className={styles.btnSocial}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng ký với Google
          </button>
          <button className={styles.btnSocial}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#1877F2"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Đăng ký với Facebook
          </button>
        </div>

        <p className={styles.loginPrompt}>
          Đã có tài khoản?{" "}
          <Link to="/login" className={styles.loginLink}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Field helper component ──
function Field({
  label,
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        <i className={`ti ${icon}`} aria-hidden="true" />
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          autoComplete="off"
        />
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
