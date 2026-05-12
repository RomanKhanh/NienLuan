# 🍜 Khám Phá Quán — Restaurant Detail Page

React + Vite + react-router-dom + react-leaflet

---

## Cài đặt & chạy

```bash
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173/restaurant/quan-ba-cam`

## Build production

```bash
npm run build    # output vào /dist
npm run preview  # preview bản build
```

---

## Cấu trúc thư mục

```
restaurant-app/
├── index.html                        ← entry HTML của Vite
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                      ← entry point
    ├── index.css                     ← CSS variables + reset
    ├── App.jsx                       ← Routes
    ├── pages/
    │   ├── RestaurantDetail.jsx      ← Trang chính (/restaurant/:id)
    │   └── RestaurantDetail.module.css
    └── components/
        ├── layout/
        │   ├── Header.jsx + .module.css
        │   └── Footer.jsx + .module.css
        ├── map/
        │   ├── MapComponent.jsx      ← react-leaflet, CartoDB tile
        │   └── MapComponent.module.css
        └── restaurant/
            ├── RestaurantInfo.jsx    ← Panel thông tin phải
            └── RestaurantInfo.module.css
```

---

## Map API

Dùng **Leaflet.js** + **CartoDB Positron** — miễn phí, không cần API key.

Đổi tile style trong `MapComponent.jsx`:

| Style            | URL |
|------------------|-----|
| CartoDB Positron | `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png` |
| CartoDB Dark     | `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` |
| OpenStreetMap    | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |

---

## Tích hợp API thực tế

Trong `RestaurantDetail.jsx`, thay mock data bằng:

```jsx
const [restaurant, setRestaurant] = useState(null)
const [loading, setLoading]       = useState(true)

useEffect(() => {
  fetch(`/api/restaurants/${id}`)
    .then(res => res.json())
    .then(data => { setRestaurant(data); setLoading(false) })
}, [id])

if (loading) return <div>Đang tải...</div>
```

### Shape của `restaurant`:

```js
{
  id:          string,
  category:    string,
  name:        string,
  rating:      number,       // 0–5
  reviewCount: number,
  isOpen:      boolean,
  tags:        string[],
  description: string,
  address:     string,
  addressSub:  string,
  lat:         number,
  lng:         number,
  hours: [{ day: string, time: string, isToday: boolean }],
  phone:       string,
  priceRange:  string,
  amenities:   string,
  images:      string[],    // URL ảnh thực (tối đa 3)
  emoji:       string,      // emoji marker bản đồ
}
```

---

## Màu chủ đạo (CSS variables trong `index.css`)

| Variable        | Giá trị   | Dùng cho                  |
|-----------------|-----------|---------------------------|
| `--brand`       | `#B5731A` | Màu vàng nâu chính        |
| `--brand-light` | `#F5E6C8` | Nền nhạt, tags, action bar|
| `--brand-mid`   | `#D4943A` | Accent, nút đăng ký       |
| `--brand-dark`  | `#7A4A0A` | Header, footer, text title|
| `--bg-page`     | `#FBF5EC` | Nền toàn trang            |
