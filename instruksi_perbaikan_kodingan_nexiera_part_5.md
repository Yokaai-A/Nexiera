# **Spesifikasi Teknis & Refaktorisasi UI/UX NEXIERA (Part 5)**

Dokumen panduan implementasi teknis untuk pembersihan istilah visual, penyederhanaan modul dashboard, sistem ulasan & pelaporan, kustomisasi profil/banner pengajar, serta pengaturan akun di platform NEXIERA.

---

## **1. Pembersihan Bahasa UI & Eliminasi AI-Slop**

### **A. Hapus Istilah "CRM" Eksplisit**
* **Aturan Bahasa**: Jangan tampilkan istilah "CRM" secara eksplisit pada antarmuka pengguna (tombol, header, menu sidebar, atau tooltip).
* **Pengganti Istilah**:
  * `Dashboard CRM` $\rightarrow$ **Dashboard / Area Bimbingan**
  * `Data Peserta CRM` $\rightarrow$ **Daftar Peserta**
  * `CRM Tutor` $\rightarrow$ **Dashboard Pengajar**

### **B. Penataan Header Dashboard & Eliminasi Pill Badge**
* **Hapus Pill Badges**: Hilangkan semua elemen kapsul/badge berlatar warna (`RINGKASAN MAHASISWA`, `Terverifikasi Kampus`) di header dashboard.
* **Pembersihan Teks Sapaan**:
  * Hapus penyebutan nama kampus spesifik dan badge verifikasi palsu dari header utama.
  * **Teks Sapaan**: `Halo, [Nama Pengguna]`
  * **Subteks Netral**: *"Selamat datang di dashboard akademikmu. Akses jadwal bimbingan dan materi kuliah sesuai kurikulum perkuliahanmu."*

### **C. Konsistensi Warna & Dark Mode**
* **Solid Blue**: Kunci warna utama pada **Solid Blue `#2563EB`** (`bg-blue-600`).
* **Tombol**: Semua tombol berlatar `#2563EB` **wajib menggunakan teks putih solid** (`text-white`), baik di Light Mode maupun Dark Mode.

---

## **2. Restrukturisasi Navigasi & Proteksi Fitur (`/buat-kelas`)**

### **A. Navbar Publik (`/components/Navbar.tsx`)**
* **Menu Tengah (Publik)**:
  1. `Home` (`/`)
  2. `Cari Kelas` (`/cari-kelas`)
  3. `Tentang Kami` (`/tentang-kami`)
* **Area Utilitas Kanan**:
  * Toggle Dark Mode (🌙 / ☀️)
  * Lonceng Notifikasi
  * Tombol **`Dashboard`** (menggantikan menu `Kelas Saya`).
  * **Hapus** tombol `Buat Kelas` dari navbar publik.

### **B. Hak Akses Fitur Buat Kelas**
* Fitur pembuatan kelas hanya diakses dari dalam **Dashboard Pengajar** (`/dashboard/tutor/buat-kelas`).
* Jika *Guest* atau *Student* biasa mencoba membuka rute `/buat-kelas`, tampilkan modal proteksi/pengajuan verifikasi tutor.

---

## **3. Penyederhanaan Modul & Indikator Dashboard**

### **A. Penghapusan Modul "Target Matkul UTS/UAS"**
* Hapus sepenuhnya widget **Target Matkul UTS/UAS** beserta indikator *progress bar* persentase (80%, 60%, dsb.) dari dashboard karena tidak realistis dan membingungkan.

### **B. Kartu Statistik Utama (3 Indikator)**
Pangkas kartu indikator statistik menjadi 3 kartu ringkas:
1. **Kelas Diikuti** (Jumlah kelas aktif)
2. **Sesi Live Pekan Ini** (Jadwal sesi bimbingan mendatang)
3. **Catatan Tersimpan** (Jumlah materi/link terintegrasi)
*(Kartu ke-4 "Target Matkul" di sisi kanan dihapus sepenuhnya).*

---

## **4. Sistem Ulasan (Review) & Pelaporan (Report)**

### **A. Transparansi Review & Rating**
* **Kartu Kelas & Detail Kelas**: Menampilkan skor rating rata-rata dan total ulasan (contoh: `⭐ 4.8 (18 ulasan)`).
* **Akses Ulasan**: Pembatasan khusus untuk peserta terdaftar (*Verified Learner*) setelah sesi bimbingan selesai.
* **Integrasi Dashboard Pengajar**: Sediakan modul/tab khusus bagi pengajar (Peer-Tutor & Mitra Bootcamp) untuk memantau rating, skor kumulatif, dan ulasan yang diberikan oleh mahasiswa.

### **B. Sistem Pelaporan (Report System)**
* Ditempatkan di halaman detail kelas dan profil publik penyelenggara via tombol `Laporkan Kelas` / `Laporkan Penyelenggara`.
* **Form Modal Pelaporan**:
  * Dropdown Kategori Pelanggaran (*Materi Tidak Sesuai*, *Tutor Tidak Hadir*, *Indikasi Penipuan*, *Pelanggaran Etika*).
  * Kolom deskripsi kronologi kejadian.
* Data laporan dikirimkan ke Pusat Moderasi Admin.

---

## **5. Halaman Pengaturan (Settings) & Kustomisasi Profil**

Implementasikan rute pengaturan di `/dashboard/pengaturan`:

### **A. Pengaturan Foto Profil & Cover Banner**
* **Foto Profil / Logo**:
  * Akun Mahasiswa / Peer-Tutor: Unggah/ganti foto profil pribadi.
  * Akun Bootcamp: Unggah/ganti logo resmi organisasi.
* **Cover Banner Sampul**:
  * Mitra Bootcamp & Peer-Tutor dapat mengunggah dan mengganti gambar *Cover Banner* profil publik mereka.
  * Banner tampil bersih di header profil publik tanpa teks overlay yang menumpuk.

### **B. Pengaturan & Verifikasi Email**
* **Ganti Email**: Pengguna dapat memperbarui alamat email terhubung.
* **Verifikasi Email Kampus**: Input email domain resmi (`@binus.ac.id` / `@binus.edu`) untuk pengiriman 6 digit kode OTP simulasi guna mengaktifkan badge *Mahasiswa Terverifikasi*.

---

## **6. Ringkasan File Target Refaktorisasi**

| File Path | Perubahan Utama |
| --- | --- |
| `components/Navbar.tsx` | Ubah label `Kelas Saya` $\rightarrow$ `Dashboard`, hapus `Buat Kelas` publik, rapikan Dark Mode toggle. |
| `app/dashboard/page.tsx` | Hapus pill badges header, hapus widget Target Matkul, pangkas statistik ke 3 kartu utama. |
| `app/dashboard/pengaturan/page.tsx` | Tambahkan modul ganti foto/logo, upload cover banner, ganti email, dan verifikasi OTP email kampus. |
| `app/dashboard/tutor/ulasan/page.tsx` | Buat modul pemantau ulasan dan rating untuk pengajar/bootcamp. |
| `components/class/ReportModal.tsx` | Buat komponen modal pelaporan kelas dan penyelenggara. |
| `components/class/ReviewSection.tsx` | Buat daftar ulasan terverifikasi di halaman detail kelas. |
