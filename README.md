# Football Rating Prediction System

Sistem prediksi rating dan potensi pemain sepak bola berbasis Machine Learning. Proyek ini terdiri dari backend (Flask API + model Random Forest) dan frontend (React + Vite) yang memungkinkan pengguna memprediksi rating pemain berdasarkan data atribut dan skill.

## Fitur Utama
- Prediksi **Overall Rating** dan **Potential Rating** pemain sepak bola
- Input fleksibel: bisa mengisi composite score langsung atau detail per skill
- Analisis insight dan rekomendasi otomatis
- Export hasil prediksi ke PDF
- Confidence score untuk setiap prediksi

## Struktur Proyek

```
football-rating-predict/
├── python/           # Backend Flask API & model ML
│   ├── app.py
│   ├── ...
├── front-end/       # Frontend React (Vite)
│   ├── src/
│   ├── public/
│   ├── ...
├── README.md
```

## Cara Setup & Menjalankan

### 1. Backend (Flask API)

1. Masuk ke folder `python/`
2. Pastikan Python 3.8+ sudah terinstall
3. Install dependencies:
   ```bash
   pip install flask flask-cors scikit-learn pandas joblib
   ```
4. Jalankan API:
   ```bash
   python app.py
   ```
   API akan berjalan di `http://localhost:5001`

### 2. Frontend (React)

1. Masuk ke folder `front-end/`
2. Install Node.js (disarankan versi 18+)
3. Install dependencies:
   ```bash
   npm install
   # atau jika menggunakan pnpm:
   pnpm install
   ```
4. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```
   Frontend akan berjalan di `http://localhost:5173`

### 3. Akses Aplikasi

Buka browser ke `http://localhost:5173` dan gunakan form prediksi.

## Catatan Penting
- Pastikan backend sudah berjalan sebelum menggunakan frontend
- Model ML dan file scaler sudah tersedia di folder `python/`
- Untuk pengembangan, sesuaikan endpoint API jika port berbeda

## Kontributor
- Frans Gabriel Hutauruk
- Rafi
- Korelasi Team

---
*Proyek ini dibuat untuk tugas akhir Data Science Semester 6*
