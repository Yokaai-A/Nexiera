# Spesifikasi Teknis Refaktorisasi Multi-Role, Iklan, Pembayaran, Refund & Pembatalan Kelas (NEXIERA MVP)

Dokumen ini merupakan acuan teknis resmi untuk eksekusi platform NEXIERA. Seluruh arsitektur dirancang agar tetap efisien, ramping (*MVP-friendly*), transparan, dan aman secara operasional.

## 1. Pembaruan Navigasi & Tampilan UI

### A. Pemisahan Pengaturan Akun & Data Kontak Mahasiswa

* **Pengaturan Akun Standar (`/pengaturan`)**: Halaman tersendiri di luar dashboard untuk mengelola profil pengguna, verifikasi email, **Nomor Telepon / WhatsApp (wajib)**, serta data akademis (kampus & prodi).
* **Integrasi Nomor WhatsApp**: Penambahan *field* nomor WhatsApp pada profil mahasiswa berfungsi untuk mempermudah komunikasi langsung (*direct chat*) antara pengajar/mitra dengan peserta tanpa perlu membangun sistem perpesanan internal (*chat system*) di platform pada skala MVP.

### B. Pengaturan Bimbingan (`/dashboard/settings`)

* Khusus di dalam dashboard tutor/mitra untuk pengaturan operasional kelas, jadwal ketersediaan, serta profil publik pengajar/organisasi.

### C. Pembersihan Navbar & Dropdown Profil

* **Integrasi Data Akademik**: Menu *Informasi Akademik* dihapus dari dropdown navbar. Seluruh bidang data kampus dan status verifikasi disatukan ke halaman `/pengaturan`.
* **Hirarki Menu Dropdown**:
  1. Ringkasan Profil Singkat (Nama & Role Aktif)
  2. Dashboard
  3. Pengaturan Akun
  4. Logout

### D. Penyederhanaan Role Switcher & Perbaikan UI Status Badge

* **Role Switcher Sidebar**: Teks disederhanakan (misal: "Mahasiswa"), serta seluruh *pill badge* kapsul, tombol redundan di bawah, dan istilah terjemahan dalam kurung `(Student)` dihapus.
* **Sembunyikan Debug Mode**: Tombol *Reset Akun* disembunyikan pada *environment* `production`.
* **Perbaikan Badge Status Saldo (CSS Fix)**: Pada tabel transaksi keuangan (`/dashboard/keuangan`), tambahkan aturan CSS `white-space: nowrap;` pada badge status (seperti `PENDING BALANCE`) agar teks tidak bertumpuk/terpotong secara vertikal.

---

## 2. Manajemen Kelas, Peserta & Pembatalan Otomatis

### A. Restriksi Form Pembuatan Kelas

* **Mitra Bootcamp**: Field tipe kelas otomatis dikunci (*locked*) pada opsi **Bootcamp**.
* **Nama Organisasi**: Field terisi otomatis (*auto-fill*) dan bersifat *read-only* sesuai data profil mitra.

### B. Perbaikan Bug "Edit Kelas"

* **Navigasi Dynamic Route**: Tombol *Edit Kelas* mengarahkan pengguna ke `/dashboard/tutor/kelas/[id]/edit`.
* **Pre-fill Data**: Form memuat data awal (*initial values*) kelas secara otomatis.
* **HTTP Method**: Pengiriman pembaruan menggunakan metode `PUT` / `PATCH` ke endpoint API `/api/kelas/[id]`.

### C. Manajemen Peserta Bimbingan (MVP-Friendly)

* **Otomasi Status Pendaftaran**: Status `Aktif` dipicu otomatis oleh *webhook payment gateway* saat transaksi bernilai `PAID`. Tidak ada alur persetujuan manual dari pengajar untuk memangkas kompleksitas MVP.
* **Tracking Presensi Ringkas**: Kehadiran cukup ditampilkan dalam format angka ringkas (contoh: `3/4 Sesi`) tanpa manajemen presensi yang rumit.
* **Akses Kontak Langsung**: Baris peserta atau modal detail peserta menyediakan tautan langsung ke **Email** (`mailto:`) dan **WhatsApp** (`wa.me/`) agar pengajar/mitra dapat menghubungi mahasiswa atau membuat grup bimbingan secara eksternal.

### D. Alur Pembatalan Kelas & Auto-Refund oleh Pengajar

1. **Inisiasi Pembatalan**: Pengajar menekan tombol **`Batalkan Kelas`** pada halaman detail kelas (`/dashboard/tutor/kelas/[id]`) dan mengisi alasan pembatalan.
2. **Peringatan & Konfirmasi**: Sistem menampilkan modal peringatan bahwa pembatalan berkonsekuensi pengembalian dana 100% ke seluruh peserta.
3. **Eksekusi Backend**:
   * Status kelas di database berubah menjadi `CANCELLED`.
   * Akses link *meeting* (Zoom/GMeet) dan materi otomatis ditutup.
   * *Pending Balance* pengajar untuk kelas tersebut dihapus menjadi $\text{Rp } 0$.
4. **Auto-Refund Transaksi**:
   * Sistem otomatis menyetujui (*auto-approve*) pengembalian dana 100% penuh untuk seluruh peserta terdaftar tanpa potongan.
   * Komisi platform untuk transaksi terkait otomatis dibatalkan ($\text{Rp } 0$).
5. **Notifikasi**: Email dan notifikasi aplikasi dikirimkan secara paralel ke seluruh pelajar terdaftar berisi alasan pembatalan dan status pengembalian dana.

---

## 3. Sistem Pengiklanan Mandiri Berbayar (*Self-Serve Ads*)

### A. Hak Akses & Monetisasi

* Khusus untuk akun **Mitra Bootcamp** dan **Peer-Tutor** terverifikasi.
* Sistem menerbitkan invoice otomatis via *payment gateway* sebelum iklan diverifikasi oleh admin.

### B. Penempatan Slot Iklan & Dimensi Aset

| Nama Slot Iklan | Target Area UI | Dimensi Rekomendasi | Rasio Aspect |
| ----- | ----- | ----- | ----- |
| **Hero Main Banner** | Carousel Header Katalog Utama | **1200 x 350 px** | 24:7 |
| **In-Feed Search Banner** | Header / Sisipan Katalog Pencarian (`/kelas`) | **1200 x 200 px** | 6:1 |
| **In-Feed Sponsored Card** | Position 1-2 Grid Pencarian Kelas (`/kelas`) | **600 x 338 px** | 16:9 |
| **Sidebar Banner** | Bilah Samping Filter Catalog / Detail Kelas | **300 x 250 px** | 6:5 |

### C. Mekanisme Fallback (Banner Official NEXIERA)

* Jika tidak ada iklan berbayar aktif dari mitra/tutor (`active_ads == 0`), slot iklan secara otomatis menampilkan **Banner Official NEXIERA**.
* Banner bawaan digunakan untuk promosi internal platform (misal: *"Ajak Teman Bimbingan di NEXIERA"*, *"Panduan Tutor"*, atau *"Fitur Baru NEXIERA"*) sehingga tata letak UI tetap rapi dan estetik.

### D. Analitik Performa Iklan & CTR

* Dasbor Pengiklanan (`/dashboard/iklan`) menyediakan 4 metrik utama:
  1. **Total Tayang (Impressions)**: Frekuensi banner ditampilkan di layar pengguna.
  2. **Total Klik (Clicks)**: Jumlah klik pengunjung ke detail kelas.
  3. **Rata-Rata CTR (Click-Through Rate)**: Persentase efektivitas iklan dengan rumus:
     $$\text{CTR} = \left(\frac{\text{Total Klik}}{\text{Total Tayang}}\right) \times 100\%$$
  4. **Total Investasi Iklan**: Akumulasi biaya sewa slot yang dikeluarkan.

---

## 4. Sistem Keuangan, Pembayaran & Penarikan Dana (*Payout*)

### A. Skema Pembayaran

* **Metode**: QRIS & Transfer Bank (Virtual Account) dengan konfirmasi *real-time* via *webhook*.
* **Komisi Platform**: Pemotongan otomatis sebesar **5% – 10%** dari setiap transaksi kelas berbayar.

### B. Manajemen Saldo Platform (Tanpa Internal Wallet)

* Hasil penjualan bersih setelah dikurangi komisi platform dialokasikan ke **Pending Balance** di menu `/dashboard/keuangan`.
* Pengajar/Mitra dapat menekan **Tarik Dana (Payout)** untuk mencairkan akumulasi saldo yang sudah *cleared* langsung ke rekening bank pribadi terdaftar.

---

## 5. Sistem Refund (Pengembalian Dana Mahasiswa)

### A. Prinsip Utama (Tanpa Wallet Internal & Voucher)

* Platform **TIDAK** menyediakan fitur *internal wallet* maupun voucher pengembalian dana untuk menjaga arsitektur MVP tetap ramping.
* Pengembalian dana ditransfer **langsung ke Rekening Bank / E-Wallet** yang diinput oleh mahasiswa saat mengisi formulir pengajuan refund di `/pengaturan/transaksi`.

### B. Aturan & Syarat Pengajuan Refund

1. Kelas dibatalkan oleh Pengajar/Mitra (Auto-Approved).
2. Perubahan jadwal sepihak oleh Pengajar dan siswa tidak setuju (Auto-Approved).
3. Pengajuan pembatalan mandiri oleh pelajar minimal **24 jam (H-24)** sebelum sesi kelas dimulai (Auto-Approved).
4. Komplain kendala pelaksanaan/kualitas kelas (Manual Review oleh Admin).

### C. Dampak Keuangan Refund

* Nominal refund ditarik dari *Pending Balance* pengajar untuk kelas terkait.
* Potongan komisi platform untuk transaksi tersebut otomatis dibatalkan.

---

## 6. Fitur Pelengkap & Keamanan Transaksi

* **Dasbor Metrik Keuangan**: Menampilkan 4 ringkasan (*Pending Balance*, *Total Pendapatan Kotor*, *Komisi Platform*, *Total Telah Ditarik*), tabel transaksi per mata kuliah, dan riwayat *payout*.
* **Proteksi Tautan Sesi**: Link pertemuan (Zoom/GMeet/Drive) hanya di-*render* di UI mahasiswa jika status transaksi pada database bernilai `PAID`.
* **Rating & Dispute System**: Ulasan hanya dapat diberikan oleh peserta terdaftar yang mengikuti kelas. Fitur **Laporkan Sesi (*Report Issue*)** membekukan *pending balance* jika tutor tidak hadir dalam 15 menit pertama tanpa kabar.