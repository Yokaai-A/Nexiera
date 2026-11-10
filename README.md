# 🎓 NEXIERA

> **Platform Bimbingan Belajar & Peer-Tutoring Mahasiswa**  
> NEXIERA menghubungkan mahasiswa dengan Peer-Tutor terverifikasi dan Mitra Bootcamp untuk pengalaman belajar mata kuliah kampus yang lebih terarah, aman, dan fleksibel.

---

## 🚀 Fitur Utama

### 👨‍🎓 Mahasiswa & Peserta

- **Autentikasi Aman:** Pendaftaran manual dengan tautan verifikasi email sekali pakai serta opsi login via Google OAuth.
- **Pencarian & Kelas Bimbingan:** Eksplorasi katalog mata kuliah kampus, pendaftaran bimbingan, dan akses ruang belajar.
- **Pengajuan Mata Kuliah Baru:** Formulir khusus untuk mengusulkan mata kuliah yang belum tersedia di katalog statis.
- **Sistem Pelaporan:** Melaporkan kendala kelas atau tutor dengan pembaruan status dan catatan transparan dari admin.

### 👩‍🏫 Peer-Tutor & Mitra Bootcamp

- **Verifikasi Berkas Strict:** Pendaftaran peran wajib mengunggah bukti mahasiswa aktif (KTM/SIAKAD/KRS).
- **Status `PENDING_VERIFICATION`:** Akses peran pengajar baru aktif setelah berkas diverifikasi secara manual oleh admin.
- **Manajemen Kelas:** Pengelolaan jadwal, materi bimbingan, dan peserta kelas.

### 🛡️ Transaksi, Keamanan & Admin Operasional

- **Dashboard Admin Internal:** Antarmuka khusus bagi pemilik email `ADMIN_EMAILS` untuk meninjau berkas pendaftaran peran, memproses refund, dan menindaklanjuti laporan.
- **Fail-Safe Midtrans:** Transaksi otomatis diubah ke status `FAILED` jika terjadi masalah pada gateway pembayaran, mencegah celah akses kelas gratis.
- **Alur Refund Manual:** Persetujuan refund wajib melampirkan bukti transfer resmi sebelum status berubah ke `REFUNDED` dan hak akses kelas dicabut secara otomatis.
- **Privasi Berkas (`private-uploads`):** Dokumen sensitif (KTM, KRS, bukti refund, dan bukti laporan) tersimpan di direktori privat yang dilindungi _middleware_ autentikasi (hanya diakses oleh pemilik & admin).
- **Notifikasi Asinkron (Resend):** Sistem email _non-blocking_ untuk konfirmasi pembayaran, pembaruan refund, status laporan, dan verifikasi akun.

---

## 🛠️ Teknologi & Fitur MVP

| Komponen            | Teknologi / Library                                             |
| ------------------- | --------------------------------------------------------------- |
| **Frontend**        | Next.js 16, React 19, TypeScript, Tailwind CSS 4                |
| **Backend**         | NestJS 12, TypeScript, Prisma 7 (ORM)                           |
| **Database**        | MySQL                                                           |
| **Payment Gateway** | Midtrans (Sandbox / Production)                                 |
| **Email Service**   | Resend API (Async / Non-blocking MailService)                   |
| **Storage**         | Private Local Uploads (`/private-uploads`) dengan proteksi Auth |

---

## 📂 Struktur Repositori

```text
.
├── nexiera-frontend/   # Aplikasi Web Client (Next.js 16)
├── nexiera-backend/    # REST API, Prisma Schema, & Middleware (NestJS 12)
├── .github/workflows/  # CI/CD GitHub Actions (Auto Build Check)
└── DEPLOYMENT.md       # Panduan Deployment Staging (Vercel + Railway)
```

---

## 💻 Cara Menjalankan Secara Lokal

### Prasyarat

- **Node.js** v22.22.3 atau versi lebih baru
- **npm** v10+
- **MySQL** (Bisa menggunakan instance lokal atau `docker-compose.yml` yang disediakan)

---

### 1. Konfigurasi & Jalankan Backend

```bash
cd nexiera-backend
npm ci
```

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Jalankan migrasi database dan server pengembangan:

```bash
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

> 📍 Backend berjalan di `http://localhost:4000` (Prefix API: `/api`).

---

### 2. Konfigurasi & Jalankan Frontend

Buka terminal baru:

```bash
cd nexiera-frontend
npm ci
```

Buat file `nexiera-frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

Jalankan aplikasi frontend:

```bash
npm run dev
```

> 📍 Frontend berjalan di `http://localhost:3000`.

---

## ⚙️ Pengaturan Environment Variable (`nexiera-backend/.env`)

| Variabel                 | Deskripsi                              | Keterangan                                         |
| ------------------------ | -------------------------------------- | -------------------------------------------------- |
| `DATABASE_URL`           | URL koneksi MySQL Prisma               | Contoh: `mysql://root:pass@localhost:3306/nexiera` |
| `PORT`                   | Port server backend                    | Default: `4000`                                    |
| `JWT_SECRET`             | Key rahasia token autentikasi          | Wajib diisi string acak & kuat                     |
| `ADMIN_EMAILS`           | Email staf yang diberi hak akses Admin | Pisahkan dengan koma (misal: `admin@nexiera.id`)   |
| `MIDTRANS_SERVER_KEY`    | Server key dari dashboard Midtrans     | Kosongkan jika belum menggunakan tes pembayaran    |
| `MIDTRANS_IS_PRODUCTION` | Flag mode Midtrans (`true`/`false`)    | Set `false` untuk mode Sandbox                     |
| `RESEND_API_KEY`         | API Key dari platform Resend           | Opsional (Email tetap non-blocking jika kosong)    |
| `MAIL_FROM`              | Alamat email pengirim resmi            | Gunakan `onboarding@resend.dev` saat testing       |

---

## 🚀 Catatan Deployment & Staging

- **Panduan Lengkap:** Tinjau berkas [`DEPLOYMENT.md`](DEPLOYMENT.md) untuk langkah-langkah penghubungan otomatis repositori monorepo ini ke **Vercel** (Frontend) dan **Railway** (Backend & Database).
- **Auto-Migration:** Script `npm run start:prod` pada backend akan otomatis mengeksekusi `npx prisma migrate deploy` setiap kali deployment dilakukan.
- **Penyimpanan Berkas:** Pada lingkungan produksi, disarankan mengintegrasikan cloud object storage privat (seperti AWS S3 / Cloudinary) untuk menggantikan direktori lokal `private-uploads`.

---

made with ❤️
