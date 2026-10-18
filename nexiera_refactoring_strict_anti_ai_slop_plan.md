# 🛠️ NEXIERA — Dokumentasi Perbaikan UI/UX & Refactoring Sistem (MVP)

Dokumen ini berisi panduan spesifikasi teknis ketat, instruksi anti-improvisasi AI, serta refactoring alur pengguna (_user flow_) untuk platform NEXIERA.

---

## 🚨 1. PANDUAN KETAT EKSEKUSI (FOR AI CODER)

> **PRINSIP UTAMA: ZERO UNSOLICITED IMPROVISATION**  
> AI Coder **DILARANG HARAM** menambahkan komponen, _section_, _badge_, _rating_, _social proof_, atau elemen visual baru yang tidak tertulis secara eksplisit dalam dokumen ini. Ikuti spesifikasi persis seperti yang diperintahkan. KECUALI IMPROVISASI YANG DILAKUKAN TIDAK ADA AI SLOP DIDALAMNYA SEPERTI KETERANGAN KETERANGAN DIBAWAH.

### 🛑 Checklist Larangan Keras (Anti-AI Slop)

1. **DILARANG Menambah Floating Pill Badges Dekoratif**
   - _Salah_: Menempelkan _pill badge rounded_ melayang seperti `● Platform No. 1`, `Notion Study Hub`, atau `Terverifikasi Kampus` di atas headline atau kartu.
   - _Benar_: Tampilkan teks bersih tanpa _badge_ melayang. Gunakan kontras tipografi (_weight_ & _color_) untuk hirarki visual.

2. **DILARANG Menggunakan Angka / Statistik Palsu (Fake Social Proof)**
   - _Salah_: Menampilkan angka statistik seperti `15.000+ Mahasiswa`, `450+ Tutor`, atau `4.9 ★`.
   - _Benar_: Hapus total area angka statistik dari Hero Section karena NEXIERA adalah produk baru.

3. **DILARANG Menyampah Hashtags di Card**
   - _Salah_: Menampilkan `#ComputerScience`, `#AlgoProg`, `#C-Language` di bagian bawah kartu kelas.
   - _Benar_: Hapus semua _hashtag_. Cukup tampilkan nama Kategori Utama dan Jurusan secara bersih.

4. **DILARANG Mencantumkan Gelar, Jabatan Formal, & Kode Course**
   - _Salah_: `Kevin Sanjaya, S.Kom`, `Mantan Aslab`, atau `COMP6047`.
   - _Benar_: Tulis nama bersih `Kevin Sanjaya`, peran alami `Mahasiswa Computer Science BINUS`, dan nama matkul bersih `Algorithm and Programming`.

5. **DILARANG Hardcode Nama Brand Tool (Notion)**
   - _Salah_: Menggunakan judul "Notion Study Hub" atau tombol "Buka Catatan di Notion".
   - _Benar_: Gunakan istilah netral **Link Catatan** atau **Catatan Belajar**.

---

## 🎨 2. Spesifikasi Presisi Layout & Komponen UI

### 2.1 Perbaikan Layout Hero Section & Navbar Profile

- **Hero Section Layout Constraint**:
  - Gunakan layout `grid grid-cols-1 lg:grid-cols-2 items-center gap-8` di dalam pembatas `max-w-7xl mx-auto`.
  - Gambar ilustrasi di sebelah kanan **WAJIB** dibatasi ukurannya menggunakan `object-contain` dan `max-h-[400px]` agar tidak mengacak-acak simetri atau membuat _padding_ teks di sebelah kiri terdorong.

- **Redesain Profil Navbar (Sisi Kanan - Authenticated State)**:
  - **Spesifikasi**: Tampilkan **HANYA Avatar Circle** (foto profil melingkar ukuran 32x32px atau 36x36px) dengan indikator panah _dropdown_ halus.
  - **Aturan Strict**: DILARANG menampilkan nama lengkap, nama kampus, atau jurusan langsung di baris Navbar. Detail pengguna HANYA boleh muncul di dalam _dropdown menu_ saat avatar diklik.

---

## 🔍 3. Restrukturisasi Dropdown Filter & Kartu Kelas

### 3.1 Refactoring 3-Level Dropdown Filter (`/cari-kelas`)

Gantikan filter lama _"Bidang Keahlian"_ dengan 3 _dropdown_ terpisah yang presisi:

```text
[ Dropdown 1: Kategori Utama ▾ ] ➔ [ Dropdown 2: Jurusan ▾ ] ➔ [ Dropdown 3: Mata Kuliah ▾ ]
```

1. **Dropdown 1 — Kategori Utama**:
   - _Opsi_: Sains & Teknologi, Ekonomi & Bisnis, Sosial & Hukum, Kesehatan & Kedokteran, Seni & Desain, Pertanian & Peternakan.
   - 🛑 _Aturan Strict_: "Computer Science" BUKAN Kategori Utama, melainkan nama Jurusan.

2. **Dropdown 2 — Jurusan**:
   - _Opsi_: Computer Science, Information Systems, Mobile Application & Technology, Cyber Security, Akuntansi, Manajemen, dll.

3. **Dropdown 3 — Mata Kuliah**:
   - _Opsi_: Algoritma & Pemrograman, Struktur Data, Rekayasa Perangkat Lunak, Kalkulus, dll.

### 3.2 Tampilan Struktur Kartu Kelas (`Class Card`)

- **Header Kartu**: Tampilkan nama **Kategori Utama** dalam teks kapital netral (contoh: `SAINS & TEKNOLOGI`), dengan subtext **Jurusan** di bawahnya (contoh: _Computer Science_).
- **Judul Mata Kuliah**: Tampilkan nama matkul secara murni tanpa kode matkul internal atau _placeholder_ (contoh: `Algorithm and Programming`).
- **Format Nama Tutor**: Tulis nama bersih mahasiswa tanpa gelar formal (contoh: `Kevin Sanjaya`).

---

## 📝 4. Form Buat Kelas & Pengelolaan Link Akses (`/buat-kelas`)

### 4.1 Field Tambahan Form Buat Kelas

1. **Section Kategori & Akademik**:
   - Dropdown 1: **Kategori Utama** (_Required_)
   - Dropdown 2: **Jurusan** (_Required_)
   - Input Text 3: **Nama Mata Kuliah** (_Required_)

2. **Section Link Akses Pembelajaran**:
   - Input Text: **Link Sesi Live** (_Zoom / Google Meet / Discord_)
   - Input Text: **Link Catatan / Materi** (_Opsional_)
   - Input Text: **Link Penyimpanan / Rekaman Sesi** (_Opsional_) — Memfasilitasi mahasiswa yang berhalangan hadir saat sesi _live_.

3. **Section Penyelenggara & Multi-Tutor**:
   - _Peer-Tutoring_: Terkunci untuk 1 Tutor Mahasiswa.
   - _Bootcamp_: Form Identitas Organisasi + Tombol **`+ Tambah Pengajar`** untuk menginputkan tim pengajar (_Multi-Tutor_).

### 4.2 Strict Conditional Rendering (Invisible Flow)

Setiap kelas menyimpan 3 jenis tautan pembelajaran:

> ⚠️ **Aturan Conditional Rendering (Invisible):**
>
> - **Link Catatan**: Jika `linkCatatan` tidak diisi tutor (`null` / `undefined` / `""`), komponen **WAJIB TIDAK DI-RENDER (`return null;`)**. DILARANG membuat tombol _disabled_ atau _placeholder_.
> - **Link Penyimpanan / Rekaman Sesi**: Jika `linkPenyimpanan` tidak diisi tutor, komponen **WAJIB TIDAK DI-RENDER (`return null;`)**.

---

## 🔄 5. Penyesuaian Alur Pendaftaran & Akses Dashboard

### 5.1 Penghapusan Access Hub Terkunci di Halaman Detail

- Hapus komponen _"Centralized Access Hub"_ (kotak link terkunci) dari halaman detail kelas publik (`/bootcamps/[slug]`).
- Halaman detail publik murni berfungsi sebagai katalog informasi (deskripsi matkul, silabus, jadwal, dan profil tim pengajar).

### 5.2 Alur Setelah Klik "Daftar Kelas"

1. **User Klik "Daftar Kelas"**:
   - Jika _Guest_ (Belum Login) $\rightarrow$ Muncul Modal Login/Register.
   - Jika _Authenticated_ (Sudah Login) $\rightarrow$ Muncul Modal Konfirmasi Pendaftaran.
2. **Setelah Konfirmasi Berhasil**:
   - Status pendaftaran user dicatat sebagai **Terdaftar**.
   - Tampilkan Toast notification: _"Pendaftaran Berhasil!"_.
   - Tombol CTA di halaman detail kelas otomatis berganti menjadi **`[ Lihat di Kelas Saya ]`** (mengarahkan langsung ke `/kelas-saya`).
3. **Akses Link Pembelajaran**:
   - Seluruh link aktif (Live Meeting, Link Catatan, dan Link Rekaman) **murni diakses melalui halaman Dashboard Peserta (`/kelas-saya`)**.

---

## 📋 6. Matriks Ringkasan Perubahan UI & Logic

| Komponen / Fitur                 | ❌ Tampilan / Sistem Lama (AI Slop)                        | ✅ Spesifikasi Baru (Refactored)                                                       |
| :------------------------------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Pill Badges Header**           | Floating badge hiasan acak (`Notion Hub`, `Terverifikasi`) | **Dihapus total**. Tampilan bersih & fungsional.                                       |
| **Social Proof Stats**           | Angka statistik palsu (`15.000+ Mahasiswa`, `4.9★`)        | **Dihapus total**.                                                                     |
| **Filter Catalog**               | "Semua Bidang Keahlian" bercampur                          | 3 Dropdown: **Kategori Utama** $\rightarrow$ **Jurusan** $\rightarrow$ **Mata Kuliah** |
| **Identitas "Computer Science"** | Dianggap sebagai Kategori Utama                            | Dikategorikan dengan benar sebagai **Jurusan** di bawah _Sains & Teknologi_            |
| **Identitas Pengajar**           | Mencantumkan `S.Kom` & sebutan `Aslab`                     | **Nama murni mahasiswa** tanpa gelar & tanpa istilah Aslab                             |
| **Mention Notion**               | "Notion Study Hub" di mana-mana                            | Diberikan nama netral **"Link Catatan"**                                               |
| **Link Rekaman Sesi**            | Belum memfasilitasi rekaman                                | Ditambahkan **Link Penyimpanan / Rekaman** (_Invisible_ jika kosong)                   |
| **Profile Navbar**               | Box lebar (Foto + Nama + Kampus + Jurusan)                 | **Avatar Circle Ringkas** + Dropdown Menu saat diklik                                  |
| **Hero Section Right Area**      | Layout kanan meluap / merusak simetri teks                 | **Presisi Container Grid** dengan pembatas rasio gambar (`object-contain`)             |
| **Akses Link Pembelajaran**      | Terkunci di halaman detail publik                          | Dipindahkan sepenuhnya ke **Dashboard (`/kelas-saya`)**                                |
