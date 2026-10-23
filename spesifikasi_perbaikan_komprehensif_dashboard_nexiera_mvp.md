# Spesifikasi Teknis & Perbaikan Komprehensif Dashboard NEXIERA (MVP)

Dokumen ini merupakan acuan resmi perbaikan dan pengembangan halaman **Dashboard NEXIERA**. Seluruh komponen dirancang agar responsif, bebas dari data dummy (*hardcoded mock*), aman, serta mendukung multi-role (*Mahasiswa*, *Peer-Tutor*, dan *Mitra Bootcamp*).

---

## 1. Arsitektur Utama & Layout Dashboard

### A. Navigasi & Pemisahan Pengaturan
* **Pengaturan Profil Akun (`/pengaturan`)**: Ditempatkan di luar dashboard. Mengelola data pribadi pengguna, verifikasi email, data akademis, dan **Nomor WhatsApp (wajib)** untuk kontak langsung.
* **Pengaturan Bimbingan (`/dashboard/settings`)**: Ditempatkan di dalam dashboard khusus untuk tutor/mitra guna mengelola profil publik pengajar, jadwal ketersediaan, serta identitas lembaga/organisasi.
* **Pembersihan Navbar Dropdown**: Menu *Informasi Akademik* dihapus dari dropdown navbar. Menu yang tersisa:
  1. Identitas Ringkas (Nama & Role)
  2. Dashboard
  3. Pengaturan Akun
  4. Logout

### B. Role Switcher Sidebar
* **Tampilan Ramping**: Istilah terjemahan redundan (seperti `(Student)`), *pill badge* bertumpuk, serta tombol debug (*Reset Akun*) disembunyikan pada *environment production*.
* **Opsi Role**: `Mahasiswa`, `Peer-Tutor`, `Mitra Bootcamp`.

---

## 2. Fitur & Modul Dashboard per Role

### A. Dashboard Mahasiswa (`/dashboard/student`)
* **Widget Ringkasan**:
  1. *Kelas Diikuti* (Jumlah kelas aktif).
  2. *Total Sesi Dihadiri* (Progres presensi akumulatif).
  3. *Total Transaksi* (Riwayat pendaftaran).
* **Tabel / Grid Kelas Saya**:
  * Menampilkan daftar kelas yang berhasil terdaftar (Status transaksi: `PAID`).
  * **Proteksi Akses Link Meeting**: Link Zoom/GMeet/Drive hanya di-*render* jika status transaksi bernilai `PAID`. Jika kelas dibatalkan (`CANCELLED`), link otomatis dikunci kembali.
  * Tautan kontak langsung WhatsApp (`wa.me/`) dan Email (`mailto:`) ke pengajar/tutor.

### B. Dashboard Tutor & Mitra Bootcamp (`/dashboard/tutor` / `/dashboard/mitra`)

#### 1. Manajemen Kelas (`/dashboard/tutor/kelas`)
* **Restriksi Form**: Khusus Mitra Bootcamp, field tipe kelas dikunci pada opsi **Bootcamp** dan nama organisasi terisi otomatis (*read-only*).
* **Perbaikan Edit Kelas**: Menggunakan dynamic route `/dashboard/tutor/kelas/[id]/edit` dengan metode `PUT`/`PATCH` ke `/api/kelas/[id]`. Form memuat data awal secara otomatis.
* **Alur Pembatalan Kelas oleh Tutor**:
  1. Tutor menekan tombol **`Batalkan Kelas`** dan mengisi alasan pembatalan.
  2. Modal konfirmasi menampilkan peringatan auto-refund 100%.
  3. Status kelas berubah menjadi `CANCELLED`.
  4. Link *meeting* ditutup untuk seluruh peserta.
  5. Status seluruh transaksi peserta yang bernilai `PAID` otomatis diubah oleh backend menjadi `REFUNDED` (100% auto-refund).

#### 2. Daftar Peserta Bimbingan (`/dashboard/tutor/peserta`)
* **Otomasi Status**: Status `Aktif` dipicu otomatis oleh webhook payment gateway ketika pembayaran `PAID`. Tidak ada alur persetujuan manual dari pengajar.
* **Presensi Ringkas**: Kehadiran ditampilkan dalam format angka sederhana (contoh: `3/4 Sesi`).
* **Kontak Langsung**: Menyediakan tautan cepat WhatsApp (`wa.me/`) dan Email (`mailto:`) peserta tanpa fitur perpesanan internal yang rumit.

#### 3. Keuangan & Penarikan Dana / Payout (`/dashboard/keuangan`)
* **4 Metric Card Utama**:
  1. *Pending Balance*: Saldo tertahan dari kelas yang sedang berjalan.
  2. *Total Pendapatan Kotor*: Akumulasi seluruh penjualan kelas.
  3. *Komisi Platform*: Potongan platform (5% – 10%).
  4. *Total Telah Ditarik*: Saldo yang sudah berhasil ditransfer ke rekening bank.
* **Perbaikan CSS Status Badge**: Badge status saldo (seperti `PENDING BALANCE`) diwajibkan menggunakan aturan CSS `white-space: nowrap;` agar teks tidak bertumpuk/terpotong secara vertikal.
* **Pencairan Dana**: Tanpa *internal wallet*. Tutor menekan tombol **`Tarik Dana`**, lalu dana ditransfer langsung ke rekening bank terdaftar.

#### 4. Analitik Iklan Mandiri / Self-Serve Ads (`/dashboard/iklan`)
* **4 Metric Card Performa Banner**:
  1. *Total Tayang (Impressions)*: Berapa kali banner ditampilkan di katalog/pencarian.
  2. *Total Klik (Clicks)*: Berapa kali banner diklik pengunjung.
  3. *Rata-Rata CTR*: Persentase efektivitas dengan rumus:
     $$\text{CTR} = \left(\frac{\text{Total Klik}}{\text{Total Tayang}}\right) \times 100\%$$
  4. *Total Investasi Iklan*: Total akumulasi biaya sewa slot iklan.
* **Ketentuan Tampilan Slot Banner**:
  * Slot iklan murni berfungsi sebagai kontainer gambar (**pure image banner**).
  * **TIDAK BOHLEH** ada *pill badge* (seperti "Sponsor"), efek *dark gradient overlay*, maupun teks overlay (seperti *"Belajar lebih terarah bersama nexiera"*).
  * Jika tidak ada iklan berbayar aktif (`activeAds == 0`), slot otomatis menampilkan **Banner Official NEXIERA** (murni aset gambar).

---

## 3. Penanganan Data Riil & Empty States (Anti-Crash)

Untuk memastikan dashboard tidak rusak atau *crash* saat diakses pengguna baru tanpa data:

1. **Pembersihan Data Dummy**: Seluruh array statis / hardcoded JSON (seperti `const DUMMY_CLASSES`) dihapus total.
2. **Penanganan Null / Undefined**: Seluruh pemanggilan array wajib menggunakan *optional chaining* dan pengecekan panjang data (`data?.length === 0`).
3. **Komponen Empty State**: Menampilkan UI pemberitahuan yang rapi saat data kosong:
   * *Tabel Kelas*: "Belum ada kelas yang dibuat. [Buat Kelas Pertama]"
   * *Tabel Peserta*: "Belum ada mahasiswa yang mendaftar pada kelas ini."
   * *Tabel Keuangan*: "Belum ada riwayat transaksi keuangan."
   * *Tabel Iklan*: "Kamu belum memiliki iklan aktif. [Pasang Iklan]"

---

## 4. Prompt Eksekusi AI Agent (Fix Dashboard Prompt)

Gunakan prompt di bawah ini untuk menginstruksikan AI Agent (Cursor / Claude) dalam memperbaiki kodingan komponen dashboard secara otomatis:

```text
Act as a Senior Frontend & Backend Engineer. Refactor and fix the entire Dashboard implementation for NEXIERA (`nexiera-frontend/app/dashboard/` and `nexiera-backend/src/`).

Follow the specification in `docs/dashboard_fix_and_specification.md` strictly:

1. **Remove All Mock/Dummy Data**: Ensure no hardcoded JSON arrays or static numbers are used. All metrics and table rows must be fetched dynamically from the NestJS backend via Prisma API endpoints.
2. **Empty State UI**: Add fallback components with clear text and call-to-action buttons when arrays are empty (`data?.length === 0`). Ensure pages do not crash on null data.
3. **Fix CSS Badges**: Add `white-space: nowrap;` to status badges in `/dashboard/keuangan` to prevent text wrapping.
4. **Clean Banner Overlay**: Ensure banner slots in `/dashboard/iklan` and katalog pages render strictly clean images without any text overlays, pill badges, or gradient dark layers over the banner asset.
5. **Protect Meeting Links**: Verify that meeting links in `/dashboard/student` are rendered ONLY when the student's transaction status is `PAID`.
6. **Cancellation & Auto-Refund**: Connect the tutor's "Batalkan Kelas" button to trigger the backend `/api/classes/:id/cancel` endpoint, changing transaction status to `REFUNDED` and closing meeting links.
7. **Direct WhatsApp Contact**: Ensure student phone numbers (WhatsApp) render as direct `wa.me/` links on tutor dashboard participant lists.

Apply these fixes cleanly across all sub-routes of `/dashboard/`.
```