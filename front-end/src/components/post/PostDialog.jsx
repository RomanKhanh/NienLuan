import React, { useState, useEffect, useRef } from "react";
import styles from "./PostDialog.module.css";

const INITIAL = {
  restaurantName: "",
  description: "",
  openTime: "06:00",
  closeTime: "22:00",
  address: "",
  images: [],
};

export default function PostDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setForm(INITIAL);
      setErrors({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Xử lý file ảnh
  const processFiles = (files) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const valid = Array.from(files).filter((f) => validTypes.includes(f.type));

    if (!valid.length) return;

    const readers = valid.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) =>
            resolve({
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name,
              size: file.size,
            });
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((newImgs) => {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImgs].slice(0, 5), // tối đa 5 ảnh
      }));
    });
  };

  const handleFileChange = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);

  const removeImage = (id) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.restaurantName.trim())
      errs.restaurantName = "Vui lòng nhập tên quán.";
    if (!form.description.trim()) errs.description = "Vui lòng nhập mô tả.";
    if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ.";
    if (form.openTime >= form.closeTime)
      errs.closeTime = "Giờ đóng cửa phải sau giờ mở cửa.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // TODO: POST /api/posts
    setTimeout(() => {
      setLoading(false);
      onSubmit?.(form);
      onClose();
    }, 1000);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle} id="dialog-title">
            <i className="ti ti-pencil-plus" aria-hidden="true" /> Đăng bài mới
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Đóng"
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.body}>
            {/* Tên quán */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="restaurantName">
                Tên quán ăn <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrap}>
                <i className="ti ti-tools-kitchen-2" aria-hidden="true" />
                <input
                  id="restaurantName"
                  name="restaurantName"
                  type="text"
                  placeholder="VD: Quán Bà Cẩm — Cơm Tấm"
                  value={form.restaurantName}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.restaurantName ? styles.inputErr : ""}`}
                />
              </div>
              {errors.restaurantName && (
                <span className={styles.errMsg}>{errors.restaurantName}</span>
              )}
            </div>

            {/* Mô tả */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">
                Mô tả quán ăn <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Chia sẻ trải nghiệm, đặc điểm nổi bật của quán..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={`${styles.textarea} ${errors.description ? styles.inputErr : ""}`}
              />
              {errors.description && (
                <span className={styles.errMsg}>{errors.description}</span>
              )}
            </div>

            {/* Giờ mở / đóng cửa */}
            <div className={styles.timeRow}>
              <div className={styles.field} style={{ flex: 1 }}>
                <label className={styles.label} htmlFor="openTime">
                  <i className="ti ti-door-enter" aria-hidden="true" /> Giờ mở
                  cửa
                </label>
                <div className={styles.inputWrap}>
                  <i className="ti ti-clock" aria-hidden="true" />
                  <input
                    id="openTime"
                    name="openTime"
                    type="time"
                    value={form.openTime}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.timeSep}>–</div>
              <div className={styles.field} style={{ flex: 1 }}>
                <label className={styles.label} htmlFor="closeTime">
                  <i className="ti ti-door-exit" aria-hidden="true" /> Giờ đóng
                  cửa
                </label>
                <div className={styles.inputWrap}>
                  <i className="ti ti-clock" aria-hidden="true" />
                  <input
                    id="closeTime"
                    name="closeTime"
                    type="time"
                    value={form.closeTime}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.closeTime ? styles.inputErr : ""}`}
                  />
                </div>
                {errors.closeTime && (
                  <span className={styles.errMsg}>{errors.closeTime}</span>
                )}
              </div>
            </div>

            {/* Địa chỉ */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="address">
                Địa chỉ quán <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrap}>
                <i className="ti ti-map-pin" aria-hidden="true" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="VD: 105 Trần Hưng Đạo, Ninh Kiều, Cần Thơ"
                  value={form.address}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.address ? styles.inputErr : ""}`}
                />
              </div>
              {errors.address && (
                <span className={styles.errMsg}>{errors.address}</span>
              )}
            </div>

            {/* Upload ảnh */}
            <div className={styles.field}>
              <label className={styles.label}>
                <i className="ti ti-photo" aria-hidden="true" /> Hình ảnh quán
                <span className={styles.labelNote}>(tối đa 5 ảnh)</span>
              </label>

              {/* Drop zone */}
              {form.images.length < 5 && (
                <div
                  className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Khu vực tải ảnh lên"
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
                    onChange={handleFileChange}
                  />
                  <i className="ti ti-cloud-upload" aria-hidden="true" />
                  <p className={styles.dropText}>
                    Kéo thả ảnh vào đây hoặc{" "}
                    <span className={styles.dropLink}>chọn từ máy</span>
                  </p>
                  <p className={styles.dropHint}>
                    JPG, PNG, WEBP — tối đa 5 ảnh
                  </p>
                </div>
              )}

              {/* Preview grid */}
              {form.images.length > 0 && (
                <div className={styles.previewGrid}>
                  {form.images.map((img, idx) => (
                    <div key={img.id} className={styles.previewItem}>
                      <img
                        src={img.url}
                        alt={`Ảnh ${idx + 1}`}
                        className={styles.previewImg}
                      />
                      <div className={styles.previewOverlay}>
                        <span className={styles.previewIndex}>{idx + 1}</span>
                        <button
                          type="button"
                          className={styles.removeImgBtn}
                          onClick={() => removeImage(img.id)}
                          aria-label={`Xóa ảnh ${idx + 1}`}
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className={styles.mainBadge}>Ảnh bìa</span>
                      )}
                    </div>
                  ))}

                  {/* Thêm ảnh nếu chưa đủ 5 */}
                  {form.images.length < 5 && (
                    <button
                      type="button"
                      className={styles.addMoreBtn}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <i className="ti ti-plus" aria-hidden="true" />
                      <span>Thêm ảnh</span>
                    </button>
                  )}
                </div>
              )}

              <p className={styles.imageCount}>
                {form.images.length}/5 ảnh đã chọn
                {form.images.length > 0 && (
                  <button
                    type="button"
                    className={styles.clearImgBtn}
                    onClick={() => setForm((prev) => ({ ...prev, images: [] }))}
                  >
                    Xóa tất cả
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.dialogFooter}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className={styles.btnPost} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} /> Đang đăng...
                </>
              ) : (
                <>
                  <i className="ti ti-send" aria-hidden="true" /> Đăng bài
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
