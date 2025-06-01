# Lost&nbsp;&amp;&nbsp;Pawnd 📱🐶🐱  
*Final B.Sc. Computer-Science Project*  

> **Authors:**  
> **Gal Alfandary** – gal.alfandary@example.com  
> **Lina Flat** – lina.flat@example.com  

Finding lost pets & re-uniting them with their humans, powered by on-device image processing and a community-driven database.

---

## ✨ What is Lost & Pawnd?

Lost & Pawnd is a React-Native + Expo app that lets anyone

1. **Snap or upload a photo** of a pet they found (or lost).  
2. **Run a vision pipeline** (OpenCV + TensorFlow Lite) on-device to extract colour, breed and facial-landmark features.  
3. **Query the cloud database** for visually similar pets.  
4. **Contact the matching owner / finder** through chat or one-tap call.

Our goal: cut the time between “I lost my dog” and “He’s back on the couch” from days to minutes.

<p align="center">
  <!-- Replace the image below with a real screenshot -->
  <img src="docs/screenshot_placeholder.png" alt="Lost & Pawnd screenshot" width="240">
</p>

---

## 🚀 Features

| Area | Highlights |
|------|------------|
| **Image processing** | • CNN encoder for fur & colour histograms<br>• Ear-shape & muzzle landmark detection<br>• Breed classification (90 %+) |
| **Search & match** | • pgvector similarity index in Postgres<br>• Text fallback (breed + colour) |
| **Realtime updates** | • Supabase Channels “match found” push<br>• Expo Notifications |
| **Map & location** | • Reverse-geocode last-seen coords<br>• Nearby matches in MapView |
| **Community tools** | • Report spam / false positives<br>• Reputation score per user |
| **Offline first** | • SQLite cache of recent posts<br>• Background sync |

---

## 🛠️ Tech Stack

| Layer  | Tech |
|--------|------|
| **Mobile**  | React Native, Expo Router, React Navigation |
| **Vision**  | OpenCV.js, TensorFlow Lite, MMKV caching |
| **Backend** | Supabase (Postgres + RLS, Storage, Auth, Realtime) |
| **Search**  | pgvector similarity index |
| **Maps**    | react-native-maps, OpenStreetMap reverse-geocode |
| **CI / CD** | Expo EAS Build & Submit, GitHub Actions |

---