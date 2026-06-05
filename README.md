<div align="center">

# 📄 SILA_KAB
### Sistem Layanan Administrasi Kependudukan — Kabupaten

**Warga upload berkas dari rumah. Petugas cek online. Datang ke kantor cukup sekali.**

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 😤 Masalah

Kalau kamu tinggal jauh dari kota kabupaten — misalnya di Rejang Lebong, harus ke Bengkulu untuk urus KTP atau KK — ini yang biasanya terjadi:

1. Berangkat pagi, habiskan biaya & waktu
2. Sampai di kantor Capil → ternyata **ada satu berkas yang kurang**
3. Pulang, cari berkasnya, balik lagi besok
4. Ulangi dari nomor 1

Buat orang muda saja sudah melelahkan. Buat warga yang sudah tua, ini bisa sangat menyulitkan.

---

## 💡 Solusi

SILA_KAB memindahkan **proses verifikasi berkas ke ranah digital**.

```
Sebelum: datang → kurang berkas → pulang → datang lagi → ...
Sesudah: upload dari rumah → petugas cek online → datang SEKALI → selesai
```

Warga cukup datang ke kantor saat berkasnya sudah dinyatakan **lengkap dan benar** oleh petugas — membawa QR Code sebagai tanda konfirmasi.

---

## ✨ Fitur Utama

### Untuk Warga
- **Daftar dengan nomor HP** — verifikasi via OTP WhatsApp, tidak perlu password
- **Upload berkas dari HP** — foto KTP, KK, surat pengantar, dll langsung dari kamera
- **Tracking status real-time** — tahu berkas sedang diproses, disetujui, atau ada yang kurang
- **Notifikasi WhatsApp** — dikabari otomatis tiap ada perubahan status
- **QR Code undangan** — bukti digital bahwa berkas sudah lengkap, dibawa saat ke kantor

### Untuk Petugas
- **Dashboard verifikasi** — lihat semua berkas masuk, filter per jenis layanan
- **Review berkas online** — cek foto/scan dokumen warga langsung dari browser
- **Approve atau tolak** — kalau kurang, tulis alasannya supaya warga tahu apa yang perlu diperbaiki
- **Scan QR di loket** — saat warga datang, scan QR → semua data langsung muncul

---

## 🗂️ Layanan yang Didukung

| Kode | Layanan |
|------|---------|
| `KTP_NEW` | KTP Elektronik — Baru |
| `KTP_LOST` | KTP Elektronik — Hilang/Rusak |
| `KK_MOVE` | Kartu Keluarga — Pindah |
| `KK_ADD` | Kartu Keluarga — Tambah Anggota |
| `BIRTH_CERT` | Akta Kelahiran |
| `DEATH_CERT` | Akta Kematian |
| `KIA` | Kartu Identitas Anak |

---

## 🔄 Alur Aplikasi

```
Warga                          Sistem                        Petugas
  │                              │                              │
  ├─ Daftar (HP + OTP WA) ──────>│                              │
  ├─ Upload foto KTP ───────────>│                              │
  │<─ Akun aktif ───────────────-│<── Review & aktivasi ────────┤
  │                              │                              │
  ├─ Pilih jenis layanan ───────>│                              │
  ├─ Upload berkas syarat ──────>│                              │
  │                              │──── Notif berkas masuk ─────>│
  │                              │                              ├─ Review berkas
  │<── Notif WA: "Ada yang kurang"│<──────────────── Tolak ─────┤
  ├─ Perbaiki & upload ulang ───>│                              │
  │                              │<──────────────── Setujui ────┤
  │<── Notif WA: "Berkas lengkap"│                              │
  ├─ Terima QR Code ────────────<│                              │
  │                              │                              │
  │  [Datang ke kantor]          │                              │
  ├─ Scan QR di loket ──────────>│──── Data warga muncul ──────>│
  │                              │                              ├─ Proses dokumen
  │<─────────────────────────────│<────────── Status: Done ─────┤
  │  Dokumen selesai ✓           │                              │
```

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS + shadcn/ui |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (OTP via WhatsApp) |
| File Storage | Cloudinary |
| WA Gateway | Fonnte |
| QR Code | qrcode.react + @zxing/browser |
| Deployment | Vercel + MongoDB Atlas |

---

## 🗄️ Struktur Database

```
users          → data warga & petugas (auth via HP)
submissions    → pengajuan per layanan (satu schema untuk semua jenis)
uploaded_files → berkas yang diupload (relasi ke submissions)
services       → master data jenis layanan & syarat dokumen
schedules      → slot jadwal pengambilan di kantor
notifications  → log notifikasi in-app & WhatsApp
```

---

## 🚀 Cara Jalankan Lokal

### Prasyarat
- Node.js 18+
- MongoDB (lokal atau Atlas)
- Akun Cloudinary (free tier cukup)
- Token Fonnte untuk WhatsApp Gateway

### Instalasi

```bash
# Clone repo
git clone https://github.com/username/sila-kab.git
cd sila-kab

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# File Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# WhatsApp Gateway
FONNTE_TOKEN=your-fonnte-token
```

```bash
# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Folder

```
sila-kab/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (warga)/
│   │   ├── dashboard/
│   │   ├── pengajuan/
│   │   │   └── [serviceId]/
│   │   └── riwayat/
│   ├── (petugas)/
│   │   ├── dashboard/
│   │   ├── verifikasi/
│   │   │   └── [submissionId]/
│   │   └── scan/
│   └── api/
│       ├── auth/
│       ├── submissions/
│       ├── services/
│       └── schedules/
├── components/
├── lib/
│   ├── mongodb.js
│   └── cloudinary.js
├── models/
│   ├── User.js
│   ├── Submission.js
│   ├── Service.js
│   ├── UploadedFile.js
│   └── Notification.js
└── public/
```

---

## 📋 Roadmap

- [x] Desain sistem & database schema
- [ ] Auth: daftar via HP + OTP WhatsApp
- [ ] Halaman pengajuan per jenis layanan
- [ ] Upload berkas + preview
- [ ] Dashboard petugas — verifikasi berkas
- [ ] Notifikasi WhatsApp otomatis
- [ ] QR Code generate & scan
- [ ] PWA — bisa diinstall di HP

---

## 🤝 Kontribusi

Project ini dibuat sebagai portofolio dengan tujuan diusulkan ke Dinas Kependudukan dan Pencatatan Sipil setempat. Pull request dan masukan sangat terbuka!

---

## 📝 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

<div align="center">
Dibuat karena frustrasi bolak-balik Rejang Lebong–Bengkulu cuma gara-gara satu berkas kurang. 🛵
</div>