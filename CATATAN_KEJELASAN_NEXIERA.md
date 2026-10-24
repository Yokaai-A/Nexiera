# Catatan yang Perlu Dikonfirmasi untuk NEXIERA

Catatan ini merangkum keputusan produk dan konfigurasi operasional yang belum bisa dipastikan dari implementasi saat ini. Bagian yang sudah ditangani ditandai **Sudah ditangani**; sisanya masih memerlukan konfigurasi atau keputusan Anda.

## Prioritas tinggi

### 1. Pengiriman email Resend

- **Sudah ditangani:** `MailService` memakai Resend; notifikasi sistem diarahkan ke email utama akun dan dikirim non-blocking.
- **Yang belum ada:** `RESEND_API_KEY` dan `MAIL_FROM` masih kosong di `.env` lokal. Email belum benar-benar terkirim sebelum API key tersedia dan domain pengirim diverifikasi di Resend.
- **Mohon putuskan:** domain/alamat pengirim resmi NEXIERA dan apakah semua notifikasi in-app juga perlu dikirim lewat email atau hanya pembayaran, refund, laporan selesai, dan aktivasi peran.

### 2. Refund: persetujuan, pembayaran, dan pencatatan

- **Sudah ditangani:** refund memakai alur manual admin. Persetujuan mewajibkan unggah bukti transfer privat, mengubah transaksi menjadi `REFUNDED`, dan mencabut akses kelas.
- **Masih perlu diputuskan:** tim keuangan tetap perlu melakukan transfer nyata ke rekening/e-wallet pemohon sebelum menekan persetujuan. Tentukan siapa yang berwenang menyetujui dan apakah bukti transfer perlu aturan format/retensi khusus.

### 3. Pembayaran gagal saat Midtrans bermasalah

- **Sudah ditangani:** checkout yang gagal atau tidak memiliki konfigurasi Midtrans menghasilkan status `FAILED`; akses hanya dibuka setelah status benar-benar `PAID`.

### 4. Pendaftaran peran dan pemeriksaan bukti mahasiswa

- **Sudah ditangani:** pengajuan Peer-Tutor dan Mitra Bootcamp menjadi `PENDING_VERIFICATION`; akses baru dibuka setelah admin menyetujui melalui Tinjauan Admin. Pengajuan yang ditolak dapat diajukan ulang.
- **Masih perlu diputuskan:** dokumen yang diterima, masa berlaku bukti, dan standar pemeriksaan keaslian. Sistem memastikan file berasal dari akun pemohon, tetapi tidak mengotomatiskan pemeriksaan isi dokumen.

### 5. Privasi dan penyimpanan berkas

- **Sudah ditangani:** bukti mahasiswa, bukti laporan, dan bukti transfer refund masuk ke `private-uploads`; API memeriksa pemilik unggahan atau akses admin. File lama yang dirujuk database dipindahkan saat backend mulai.
- **Masih perlu diputuskan:** folder privat masih memakai disk lokal. Tentukan object storage untuk produksi, pencadangan, retensi/penghapusan berkas, dan batas ukuran/formats final.

### 6. Admin operasional

- **Sudah ditangani:** ada halaman Tinjauan Admin untuk pengajuan peran dan refund. API menerima akun yang memiliki role `ADMIN` atau email yang tercantum pada `ADMIN_EMAILS`.
- **Perlu konfigurasi Anda:** isi `ADMIN_EMAILS` pada `nexiera-backend/.env` dengan email akun staf berwenang (pisahkan beberapa alamat dengan koma). Simpan `.env` privat dan jangan commit nilainya.
- **Masih perlu diputuskan:** siapa saja yang boleh menjadi admin dan proses pencabutan akses admin saat staf keluar.

## Prioritas menengah

### 7. Status laporan dan tindak lanjut

- **Yang sudah ada:** laporan dapat bergerak ke `UNDER_REVIEW`, `RESOLVED`, atau `REJECTED`; pelapor mendapat notifikasi saat status berubah.
- **Yang belum ada:** endpoint admin tersedia untuk mengubah status, tetapi halaman antrean laporan belum masuk halaman Tinjauan Admin. Belum ada SLA, penanggung jawab, eskalasi, atau catatan keputusan laporan.
- **Mohon putuskan:** target waktu respons, apakah admin perlu daftar laporan dan kolom catatan di dashboard, serta alasan apa yang dikirim saat laporan ditolak.

### 8. Validasi email utama akun

- **Yang ditemukan:** email Google diverifikasi oleh Google saat login; alur pendaftaran dengan email dan password tidak memiliki langkah verifikasi email. Email notifikasi menggunakan alamat utama akun.
- **Mohon putuskan:** apakah akun email/password wajib memverifikasi alamat sebelum transaksi atau aktivasi peran, serta bagaimana menangani alamat email yang tidak valid/bounce.

### 9. Kehadiran kelas

- **Yang ditemukan:** endpoint presensi saat ini hanya mengembalikan status berhasil dan tidak menyimpan kehadiran ke database.
- **Mohon putuskan:** apakah presensi termasuk MVP; siapa yang dapat menandai hadir; aturan waktu/jadwal; dan apakah diperlukan rekap kehadiran untuk tutor serta mahasiswa.

### 10. Daftar mata kuliah resmi

- **Yang ditemukan:** pilihan mata kuliah dan validasi kelas yang didukung bersumber dari daftar statis di `university-courses.ts`.
- **Mohon putuskan:** kampus/mata kuliah mana yang harus tersedia pada MVP, siapa yang mengelola daftar, serta apakah kelas bebas boleh dibuat di luar daftar resmi.

## Cara memberi keputusan

Anda bisa membalas dengan nomor dan jawaban singkat, misalnya:

```text
1. Gunakan email dari domain ...; hanya kirim 4 jenis email utama.
2. Refund manual oleh admin, wajib unggah bukti transfer.
3. Jika Midtrans gagal, jangan tandai PAID.
4. Peran aktif setelah admin meninjau bukti.
```

Keputusan tersebut bisa saya pakai sebagai acuan saat melanjutkan backend dan antarmukanya.
