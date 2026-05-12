import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import styles from './MapComponent.module.css'

// Vite không xử lý require() — fix leaflet default icon bằng import trực tiếp
import markerIcon2x   from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon     from 'leaflet/dist/images/marker-icon.png'
import markerShadow   from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
})

function createCustomIcon(emoji = '🍲') {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:38px; height:38px;
        background:#B5731A;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:flex; align-items:center; justify-content:center;
        border:3px solid #fff;
        box-shadow:0 2px 8px rgba(122,74,10,0.35);
      ">
        <div style="transform:rotate(45deg); font-size:17px;">${emoji}</div>
      </div>`,
    iconSize:    [38, 38],
    iconAnchor:  [19, 38],
    popupAnchor: [0, -42],
  })
}

/**
 * Props:
 *  lat      {number}  vĩ độ
 *  lng      {number}  kinh độ
 *  zoom     {number}  mức zoom (default 16)
 *  label    {string}  tên trong popup
 *  address  {string}  địa chỉ trong popup + badge
 *  emoji    {string}  emoji trên marker
 */
export default function MapComponent({
  lat,
  lng,
  zoom = 16,
  label = 'Quán ăn',
  address = '',
  emoji = '🍲',
}) {
  const position = [lat, lng]
  const icon     = createCustomIcon(emoji)

  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={position}
        zoom={zoom}
        className={styles.map}
        scrollWheelZoom
      >
        {/* CartoDB Positron — đẹp, miễn phí, không cần API key */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/" target="_blank">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        <Marker position={position} icon={icon}>
          <Popup>
            <div className={styles.popup}>
              <strong>{label}</strong>
              {address && <span>{address}</span>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Badge địa chỉ góc trên trái */}
      <div className={styles.addressBadge}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        {address || label}
      </div>
    </div>
  )
}
