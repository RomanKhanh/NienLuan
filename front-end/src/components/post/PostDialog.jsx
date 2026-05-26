import React, { useState, useEffect, useRef } from "react";
import styles from "./PostDialog.module.css";
import {
  callCreateRestaurantAPI,
  callCreatePostAPI,
  callFetchPostsAPI,
} from "../../util/api";

const INIT_RESTAURANT = {
  name: "",
  description: "",
  category: "",
  address: "",
  addressSub: "",
  phone: "",
  priceRange: "",
  amenities: "",
  tags: "",
  openTime: "06:00",
  closeTime: "22:00",
};

const INIT_POST = { description: "", images: [] };

const CATEGORIES = [
  "Nhà hàng Nhật",
  "Nhà hàng Hàn quốc",
  "Nhà hàng Âu",
  "Cơm tấm",
  "Phở",
  "Bún bò",
  "Bánh xèo",
  "Hủ tiếu",
  "Lẩu",
  "Hải sản",
  "Đồ nướng",
  "Chay",
  "Cà phê & Tráng miệng",
];

const AMENITY_OPTIONS = [
  "Wifi",
  "Điều hoà",
  "Chỗ đậu xe",
  "Ship tận nơi",
  "Phòng riêng",
  "Khu vui chơi trẻ em",
  "Tổ chức tiệc",
];

export default function PostDialog({ open, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [restaurant, setRestaurant] = useState(INIT_RESTAURANT);
  const [post, setPost] = useState(INIT_POST);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setRestaurant(INIT_RESTAURANT);
      setPost(INIT_POST);
      setErrors({});
      setSelectedAmenities([]);
      setSelectedCategory("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleRestaurantChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleAmenity = (a) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const validateStep1 = () => {
    const errs = {};
    if (!restaurant.name.trim()) errs.name = "Vui lòng nhập tên nhà hàng.";
    if (!restaurant.address.trim()) errs.address = "Vui lòng nhập địa chỉ.";
    if (!selectedCategory) errs.category = "Vui lòng chọn loại ẩm thực.";
    if (restaurant.openTime >= restaurant.closeTime)
      errs.closeTime = "Giờ đóng cửa phải sau giờ mở cửa.";
    return errs;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const processFiles = (files) => {
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type),
    );
    if (!valid.length) return;
    Promise.all(
      valid.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve({
                id: Date.now() + Math.random(),
                url: e.target.result,
                name: file.name,
              });
            reader.readAsDataURL(file);
          }),
      ),
    ).then((newImgs) => {
      setPost((prev) => ({
        ...prev,
        images: [...prev.images, ...newImgs].slice(0, 5),
      }));
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };
  const removeImage = (id) =>
    setPost((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i.id !== id),
    }));

  const validateStep2 = () => {
    const errs = {};
    if (!post.description.trim())
      errs.postDescription = "Vui lòng mô tả trải nghiệm của bạn.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);

    try {
      // Format hours đúng kiểu model: [{ day, time, isToday }]
      const days = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
      ];
      const todayIndex = new Date().getDay(); // 0 = CN, 1 = T2, ...
      const hoursArr = days.map((day, i) => ({
        day,
        time: `${restaurant.openTime} - ${restaurant.closeTime}`,
        isToday: (i + 1) % 7 === todayIndex % 7,
      }));

      // Bước 1: Tạo restaurant
      const restaurantPayload = {
        name: restaurant.name,
        description: restaurant.description,
        category: selectedCategory,
        address: restaurant.address,
        addressSub: restaurant.addressSub,
        phone: restaurant.phone,
        priceRange: restaurant.priceRange,
        amenities: selectedAmenities.join(", "),
        tags: restaurant.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        images: post.images.map((img) => img.url),
        hours: hoursArr,
        rating: 0,
        reviewCount: 0,
      };

      const restaurantRes = await callCreateRestaurantAPI(restaurantPayload);

      if (!restaurantRes || restaurantRes.EC !== 0) {
        const errMsg =
          typeof restaurantRes?.EM === "string"
            ? restaurantRes.EM
            : "Tạo nhà hàng thất bại. Vui lòng thử lại.";
        setErrors({ submit: errMsg });
        setLoading(false);
        return;
      }

      const restaurantId = restaurantRes.DATA?.id
        ? String(restaurantRes.DATA.id)
        : null;

      if (!restaurantId) {
        setErrors({ submit: "Không lấy được ID nhà hàng. Vui lòng thử lại." });
        setLoading(false);
        return;
      }

      // Bước 2: Tạo post gắn với restaurant vừa tạo
      const postRes = await callCreatePostAPI(
        restaurantId,
        post.description,
        post.images.slice(0, 1).map((img) => img.url),
      );

      if (!postRes || postRes.EC !== 0) {
        const postErrMsg =
          typeof postRes?.EM === "string"
            ? postRes.EM
            : "Đăng bài thất bại. Vui lòng thử lại.";
        setErrors({ submit: postErrMsg });
        setLoading(false);
        return;
      }

      // Thành công
      onSubmit?.({ restaurant: restaurantRes.DATA, post: postRes.POST });
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      setErrors({ submit: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const progress = step === 1 ? 50 : 100;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.dialog} role="dialog" aria-modal="true">
        {/* ── Top bar ── */}
        <div className={styles.dialogTop}>
          <div className={styles.stepIndicator}>
            <div
              className={`${styles.stepDot} ${step >= 1 ? styles.stepDotActive : ""}`}
            >
              <i className="ti ti-building-store" />
            </div>
            <div className={styles.stepLine}>
              <div
                className={styles.stepLineFill}
                style={{ width: step === 2 ? "100%" : "0%" }}
              />
            </div>
            <div
              className={`${styles.stepDot} ${step >= 2 ? styles.stepDotActive : ""}`}
            >
              <i className="ti ti-pencil" />
            </div>
          </div>
          <div className={styles.stepLabels}>
            <span
              className={
                step === 1 ? styles.stepLabelActive : styles.stepLabelDone
              }
            >
              Thông tin quán
            </span>
            <span
              className={
                step === 2 ? styles.stepLabelActive : styles.stepLabelIdle
              }
            >
              Bài đánh giá
            </span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Đóng"
          >
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ══════════ STEP 1 ══════════ */}
        {step === 1 && (
          <>
            {/* form nằm TRONG body — body là div scroll */}
            <div className={styles.body}>
              <form id="step1-form" onSubmit={handleNext} noValidate>
                <div className={styles.stepTitle}>
                  <i className="ti ti-building-store" />
                  <div>
                    <h2>Thông tin nhà hàng</h2>
                    <p>Cho chúng tôi biết quán bạn muốn chia sẻ</p>
                  </div>
                </div>

                <Field
                  label="Tên quán ăn"
                  required
                  icon="ti-tools-kitchen-2"
                  error={errors.name}
                >
                  <input
                    name="name"
                    type="text"
                    placeholder="VD: Quán Bà Cẩm — Cơm Tấm"
                    value={restaurant.name}
                    onChange={handleRestaurantChange}
                    className={`${styles.input} ${errors.name ? styles.inputErr : ""}`}
                  />
                </Field>

                <div className={styles.field}>
                  <label className={styles.label}>
                    <i className="ti ti-category" /> Loại ẩm thực{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.chipGrid}>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`${styles.categoryChip} ${selectedCategory === c ? styles.categoryChipActive : ""}`}
                        onClick={() => {
                          setSelectedCategory(c);
                          setErrors((e) => ({ ...e, category: "" }));
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <span className={styles.errMsg}>{errors.category}</span>
                  )}
                </div>

                <Field
                  label="Địa chỉ quán"
                  required
                  icon="ti-map-pin"
                  error={errors.address}
                >
                  <input
                    name="address"
                    type="text"
                    placeholder="VD: 105 Trần Hưng Đạo, Ninh Kiều, Cần Thơ"
                    value={restaurant.address}
                    onChange={handleRestaurantChange}
                    className={`${styles.input} ${errors.address ? styles.inputErr : ""}`}
                  />
                </Field>

                <Field label="Khu vực / Quận huyện" icon="ti-location">
                  <input
                    name="addressSub"
                    type="text"
                    placeholder="VD: Quận Ninh Kiều, Cần Thơ"
                    value={restaurant.addressSub}
                    onChange={handleRestaurantChange}
                    className={styles.input}
                  />
                </Field>

                <div className={styles.timeRow}>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label className={styles.label}>
                      <i className="ti ti-door-enter" /> Giờ mở cửa
                    </label>
                    <div className={styles.inputWrap}>
                      <i className="ti ti-clock" />
                      <input
                        name="openTime"
                        type="time"
                        value={restaurant.openTime}
                        onChange={handleRestaurantChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.timeSep}>–</div>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label className={styles.label}>
                      <i className="ti ti-door-exit" /> Giờ đóng cửa
                    </label>
                    <div
                      className={`${styles.inputWrap} ${errors.closeTime ? styles.inputErr : ""}`}
                    >
                      <i className="ti ti-clock" />
                      <input
                        name="closeTime"
                        type="time"
                        value={restaurant.closeTime}
                        onChange={handleRestaurantChange}
                        className={styles.input}
                      />
                    </div>
                    {errors.closeTime && (
                      <span className={styles.errMsg}>{errors.closeTime}</span>
                    )}
                  </div>
                </div>

                <div className={styles.grid2}>
                  <Field label="Số điện thoại" icon="ti-phone">
                    <input
                      name="phone"
                      type="tel"
                      placeholder="0901 234 567"
                      value={restaurant.phone}
                      onChange={handleRestaurantChange}
                      className={styles.input}
                    />
                  </Field>
                  <Field label="Giá trung bình" icon="ti-cash">
                    <input
                      name="priceRange"
                      type="text"
                      placeholder="30.000 - 80.000đ"
                      value={restaurant.priceRange}
                      onChange={handleRestaurantChange}
                      className={styles.input}
                    />
                  </Field>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    <i className="ti ti-stars" /> Tiện ích
                  </label>
                  <div className={styles.chipGrid}>
                    {AMENITY_OPTIONS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className={`${styles.amenityChip} ${selectedAmenities.includes(a) ? styles.amenityChipActive : ""}`}
                        onClick={() => toggleAmenity(a)}
                      >
                        {selectedAmenities.includes(a) && (
                          <i className="ti ti-check" />
                        )}{" "}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Mô tả về quán" icon="ti-file-description">
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Đặc điểm nổi bật, không khí, phong cách phục vụ..."
                    value={restaurant.description}
                    onChange={handleRestaurantChange}
                    className={styles.textarea}
                  />
                </Field>

                <Field label="Tags (phân cách bằng dấu phẩy)" icon="ti-tag">
                  <input
                    name="tags"
                    type="text"
                    placeholder="Ngon, Rẻ, Sạch, Đông khách"
                    value={restaurant.tags}
                    onChange={handleRestaurantChange}
                    className={styles.input}
                  />
                </Field>
              </form>
            </div>

            {/* Footer nằm NGOÀI body, button dùng form="step1-form" */}
            <div className={styles.dialogFooter}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                form="step1-form"
                className={styles.btnNext}
              >
                Tiếp tục <i className="ti ti-arrow-right" />
              </button>
            </div>
          </>
        )}

        {/* ══════════ STEP 2 ══════════ */}
        {step === 2 && (
          <>
            <div className={styles.body}>
              <form id="step2-form" onSubmit={handleSubmit} noValidate>
                <div className={styles.stepTitle}>
                  <i className="ti ti-pencil" />
                  <div>
                    <h2>Bài đánh giá của bạn</h2>
                    <p>
                      Mô tả ngắn gọn về <strong>{restaurant.name}</strong>
                    </p>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    <i className="ti ti-message-circle" /> Mô tả ngắn về quán ăn
                    của bạn <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Món gì ngon nhất? Không khí ra sao? Dịch vụ thế nào? Có nên quay lại không?"
                    value={post.description}
                    onChange={handlePostChange}
                    className={`${styles.textarea} ${errors.postDescription ? styles.inputErr : ""}`}
                  />
                  {errors.postDescription && (
                    <span className={styles.errMsg}>
                      {errors.postDescription}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    <i className="ti ti-photo" /> Hình ảnh thực tế
                    <span className={styles.labelNote}>
                      (tối đa 5 ảnh, khuyến khích nên để đủ 5 ảnh)
                    </span>
                  </label>
                  {post.images.length < 5 && (
                    <div
                      className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ""}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && fileInputRef.current?.click()
                      }
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        className={styles.fileInput}
                        onChange={(e) => processFiles(e.target.files)}
                      />
                      <div className={styles.dropIcon}>
                        <i className="ti ti-cloud-upload" />
                      </div>
                      <p className={styles.dropText}>
                        Kéo thả hoặc{" "}
                        <span className={styles.dropLink}>chọn từ máy</span>
                      </p>
                      <p className={styles.dropHint}>
                        JPG, PNG, WEBP — tối đa 5 ảnh
                      </p>
                    </div>
                  )}
                  {post.images.length > 0 && (
                    <div className={styles.previewGrid}>
                      {post.images.map((img, idx) => (
                        <div key={img.id} className={styles.previewItem}>
                          <img
                            src={img.url}
                            alt={`Ảnh ${idx + 1}`}
                            className={styles.previewImg}
                          />
                          <div className={styles.previewOverlay}>
                            <button
                              type="button"
                              className={styles.removeImgBtn}
                              onClick={() => removeImage(img.id)}
                            >
                              <i className="ti ti-trash" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <span className={styles.mainBadge}>Ảnh bìa</span>
                          )}
                        </div>
                      ))}
                      {post.images.length < 5 && (
                        <button
                          type="button"
                          className={styles.addMoreBtn}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <i className="ti ti-plus" />
                          <span>Thêm</span>
                        </button>
                      )}
                    </div>
                  )}
                  <p className={styles.imageCount}>
                    {post.images.length}/5 ảnh
                    {post.images.length > 0 && (
                      <button
                        type="button"
                        className={styles.clearImgBtn}
                        onClick={() => setPost((p) => ({ ...p, images: [] }))}
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </p>
                </div>
              </form>
            </div>

            <div className={styles.dialogFooter}>
              {errors.submit && (
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#d44a1a",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    flex: 1,
                  }}
                >
                  <i className="ti ti-alert-circle" /> {errors.submit}
                </span>
              )}
              <button
                type="button"
                className={styles.btnBack}
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }}
              >
                <i className="ti ti-arrow-left" /> Quay lại
              </button>
              <button
                type="submit"
                form="step2-form"
                className={styles.btnPost}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} /> Đang đăng...
                  </>
                ) : (
                  <>
                    <i className="ti ti-send" /> Đăng bài
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Field({ label, required, icon, error, children }) {
  return (
    <div
      className="fieldGroup"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        marginBottom: 14,
      }}
    >
      <label
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#7a5030",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {icon && (
          <i
            className={`ti ${icon}`}
            style={{ color: "#c4601a", fontSize: "0.9rem" }}
          />
        )}
        {label}
        {required && <span style={{ color: "#d44a1a", marginLeft: 2 }}>*</span>}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 10,
          border: `1.5px solid ${error ? "#d44a1a" : "#e4d4b8"}`,
          background: "#fffdf9",
        }}
      >
        {children}
      </div>
      {error && (
        <span
          style={{
            fontSize: "0.72rem",
            color: "#d44a1a",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <i className="ti ti-alert-circle" /> {error}
        </span>
      )}
    </div>
  );
}
