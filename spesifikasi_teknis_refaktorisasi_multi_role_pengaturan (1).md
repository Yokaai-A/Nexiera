# Spesifikasi Teknis Refaktorisasi Multi-Role, Iklan, Pembayaran & Refund (NEXIERA MVP)

Dokumen ini merupakan acuan resmi untuk eksekusi teknis platform NEXIERA. Fokus utama dokumentasi ini adalah menjaga arsitektur platform tetap efisien, ramping (*MVP-friendly*), dan aman secara operasional.

---

## 1. Pembaruan Navigasi & Tampilan UI

### A. Pemisahan Pengaturan Akun & Bimbingan
* **Pengaturan Akun Standar (`/pengaturan`)**: Standalone halaman di luar dashboard untuk mengelola profil pengguna, verifikasi email, nomor telepon, dan data umum.
* **Pengaturan Bimbingan (`/dashboard/settings`)**: Khusus di dalam dashboard tutor/mitra untuk pengaturan operasional kelas, jadwal ketersediaan, serta profil publik pengajar/organisasi.

### B. Pembersihan Navbar & Dropdown Profil
* **Integrasi Data Akademik**: Menu *Informasi Akademik* dihapus dari dropdown navbar. Semua bidang data kampus, program studi, dan status verifikasi disatukan ke dalam `/pengaturan`.
* **Hirarki Menu Dropdown**:
  1. Ringkasan Profil Singkat (Nama & Role Aktif)
  2. Dashboard
  3. Pengaturan Akun
  4. Logout

### C. Penyederhanaan Role Switcher (Sidebar Dashboard)
* **Pembersihan Teks**: Penyederhanaan label UI (contoh: mengganti teks terpotong menjadi "Mahasiswa").
* **Elemen Visual**: Penghapusan *pill badge* kapsul, tombol redundan di bagian bawah sidebar, serta istilah terjemahan dalam kurung `(Student)`.
* **Lingkungan Produksi**: Menyembunyikan tombol debug *Reset Akun* pada *environment* `production`.

---

## 2. Manajemen Kelas & Perbaikan Form

### A. Restriksi Form Pembuatan Kelas
* **Mitra Bootcamp**: Field tipe kelas otomatis dikunci (*locked*) pada opsi **Bootcamp**.
* **Nama Organisasi**: Field terisi otomatis (*auto-fill*) dan bersifat *read-only* berdasarkan data di Pengaturan Bootcamp.

### B. Perbaikan Bug "Edit Kelas"
* **Navigasi Dynamis**: Tombol *Edit Kelas* di kartu/tabel mengarahkan pengguna ke route `/dashboard/tutor/kelas/[id]/edit`.
* **Pre-fill Data**: Formulir memuat data lama kelas (*initial values*) seperti judul, deskripsi, harga, jadwal, materi, dan link pertemuan.
* **HTTP Method**: Pengiriman data formulir edit menggunakan metode `PUT` / `PATCH` ke titik akhir API `/api/kelas/[id]`.

---

## 3. Sistem Pengiklanan Mandiri Berbayar (*Paid Self-Serve Ads*)

### A. Hak Akses & Monetisasi
* Khusus untuk akun **Mitra Bootcamp** dan **Peer-Tutor** yang terverifikasi.
* Sistem menerbitkan invoice otomatis melalui *payment gateway* sebelum iklan memasuki tahap peninjauan admin.

### B. Spesifikasi Dimensi Slot Iklan

| Nama Slot Iklan | Target Role | Dimensi Rekomendasi | Rasio Aspect | Tampilan UI |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Main Banner** | Mitra & Tutor | **1200 x 350 px** | 24:7 | Carousel Header Katalog |
| **In-Feed Banner Strip** | Mitra & Tutor | **1200 x 200 px** | 6:1 | Banner Sisipan Grid Kelas |
| **In-Feed Sponsored Card**| Mitra & Tutor | **600 x 338 px** | 16:9 | Kartu Kelas Prioritas |
| **Sidebar Banner** | Mitra Bootcamp | **300 x 250 px** | 6:5 | Bilah Samping Detail Kelas |

---

## 4. Sistem Keuangan, Pembayaran & Penarikan Dana (*Payout*)

### A. Skema Pembayaran
* **Metode**: QRIS & Transfer Bank (Virtual Account) dengan konfirmasi otomatis (*webhook*).
* **Platform Fee**: Platform memotong komisi sebesar **5% – 10%** dari setiap transaksi kelas berbayar.

### B. Manajemen Saldo & Payout (Tanpa Internal Wallet)
* Pendapatan bersih masuk ke **Pending Balance** di `/dashboard/keuangan`.
* Pengajar/Mitra melakukan **Tarik Dana (Payout)** langsung ke rekening bank pribadi setelah sesi kelas selesai dan mencapai ambang batas penarikan minimum.

---

## 5. Sistem Refund (Pengembalian Dana Mahasiswa)

### A. Prinsip Utama (Tanpa Wallet Internal & Voucher)
* Platform **TIDAK** menggunakan dompet digital internal (*wallet*) maupun voucher pengembalian dana guna menjaga kompleksitas kode tetap rendah.
* Dana refund dikembalikan **langsung ke Rekening Bank / E-Wallet** yang diinput oleh mahasiswa pada formulir pengajuan.

### B. Alur Pengajuan & Ketentuan

```
[Mahasiswa] -> Halaman /pengaturan/transaksi -> Ajukan Refund
    |
    v
Input Form: (Alasan + Bank/E-Wallet Tujuan + Nomor Rekening)
    |
    v
[Persetujuan Otomatis / Manual Review]
    |
    v
Status DB Update -> `REFUNDED` & Pending Balance Tutor Disesuaikan
```

* **Syarat Pengajuan**:
  1. Kelas dibatalkan oleh Pengajar/Mitra.
  2. Perubahan jadwal sepihak oleh Pengajar.
  3. Pengajuan pembatalan mandiri minimal **24 jam (H-24)** sebelum sesi pertama dimulai.
  4. Laporan/komplain kendala pelaksanaan kelas (melalui peninjauan manual Admin).
* **Dampak Keuangan**: Dana ditarik langsung dari *Pending Balance* tutor untuk kelas tersebut, dan potongan komisi platform otomatis dibatalkan.

---

## 6. Fitur Pelengkap & Keamanan Transaksi

* **Analitik Iklan & Pendapatan**: Tampilan grafik *revenue*, jumlah tayang (*impressions*), dan jumlah klik (*CTR*) pada dashboard pengajar/mitra.
* **Proteksi Tautan Sesi**: Tautan *meeting* (Zoom/GMeet/Drive) hanya di-*render* pada antarmuka mahasiswa jika status transaksi bernilai `PAID`.
* **Rating & Dispute System**: Ulasan hanya bisa diberikan oleh peserta terdaftar. Tombol **Laporkan Sesi (*Report Issue*)** hadir untuk membekukan *pending balance* jika pengajar tidak hadir dalam 15 menit pertama.