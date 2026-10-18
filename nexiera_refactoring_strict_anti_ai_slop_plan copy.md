# 🛠️ NEXIERA — Dokumentasi Perbaikan UI/UX & Refactoring Sistem (MVP)

Dokumen ini berisi panduan spesifikasi teknis ketat, instruksi anti-improvisasi AI, serta refactoring alur pengguna (_user flow_) untuk platform NEXIERA.

## 🚨 1. PANDUAN KETAT EKSEKUSI (FOR AI CODER)

> **PRINSIP UTAMA: ZERO UNSOLICITED IMPROVISATION**
>
> AI Coder **DILARANG HARAM** menambahkan komponen, _section_, _badge_, _rating_, _social proof_, atau elemen visual baru yang tidak tertulis secara eksplisit dalam dokumen ini. Ikuti spesifikasi persis seperti yang diperintahkan.

### 🛑 Checklist Larangan Keras (Anti-AI Slop)

1. **DILARANG Menambah Floating Pill Badges Dekoratif & Badge Status Palsu**
   - _Salah_: Menempelkan _pill badge rounded_ melayang seperti `● Platform No. 1`, `Notion Study Hub`, `Terverifikasi Kampus`, `RANGKUMAN SILABUS TERPADU`, `Verified BINUS CS`, atau `Founding Team 2026`.
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

6. **DILARANG Menampilkan Klaim Mitra Resmi Kampus**
   - _Salah_: Menampilkan `JARINGAN MITRA KAMPUS: BINUS University • UI • ITB • UGM • ITS` pada Footer.
   - _Benar_: Hapus total baris klaim mitra kampus dari Footer. NEXIERA tidak membutuhkan kerja sama institusional resmi pada versi MVP.

---

## 👥 2. Struktur Tim Pendiri (Halaman Tentang Kami)

Tampilkan 5 kartu profil bersih untuk tim pendiri NEXIERA (Mahasiswa BINUS University) **tanpa badge `Verified BINUS CS` atau badge tambahan lainnya**:

- **Muhammad Abyan Hanif** — Chief Executive Officer (CEO)
- **Nicholas Carlen** — Chief Finance Officer (CFO)
- **Cornelia Jovita Putri Pramesti** — Chief Marketing Officer (CMO)
- **Muhammad Afif Syauqi** — Chief Technology Officer (CTO)
- **Alexander Vian Hardjowibowo** — Chief Operational Officer (COO)

> 🛑 **Spesifikasi Kartu Tim**: Setiap kartu HANYA berisi: **Nama Lengkap, Jabatan (Role), Subtitle Jurusan/Kampus (`Computer Science, BINUS University`), serta Deskripsi Singkat Peran**. DILARANG menambahkan _icon centang hijau_, _Verified badge_, atau label dekoratif di pojok bawah kartu.

---

## 🎯 3. Revisi 3 Kartu Pilar Utama (Landing Page)

Hapus semua _eyebrow text_ kapital abu-abu di bawah judul dan sebutan spesifik "Notion/Catatan":

1. **Kartu 1 — Pemahaman Silabus Terarah**
   - _Deskripsi_: Bimbingan terstruktur yang dirancang khusus mengikuti alur silabus mata kuliah semester berjalan di kampusmu, membantu menguasai konsep sulit dengan lebih cepat.

2. **Kartu 2 — Tutor Sebaya Terpilih**
   - _Deskripsi_: Belajar langsung dengan sesama mahasiswa tingkat atas yang sudah lulus mata kuliah terkait dengan nilai memuaskan dan paham karakter perkuliahan di kampusmu.

3. **Kartu 3 — Kesiapan UTS & UAS**
   - _Deskripsi_: Latihan pembahasan soal dan pembedahan materi krusial secara intensif untuk memaksimalkan kesiapan menghadapi pekan ujian dan meningkatkan pencapaian IPK.

---

## 🎨 4. Spesifikasi Presisi Layout & Komponen UI

### 4.1 Perbaikan Layout Hero Section & Navbar Profile

- **Hero Section Layout Constraint**:
  - Gunakan layout `grid grid-cols-1 lg:grid-cols-2 items-center gap-8` di dalam pembatas `max-w-7xl mx-auto`.
  - Gambar ilustrasi di sebelah kanan **WAJIB** dibatasi ukurannya menggunakan `object-contain` dan `max-h-[400px]` agar tidak mengacak-acak simetri atau membuat _padding_ teks di sebelah kiri terdorong.

- **Redesain Profil Navbar (Sisi Kanan - Authenticated State)**:
  - **Spesifikasi**: Tampilkan **HANYA Avatar Circle** (foto profil melingkar ukuran 32x32px atau 36x36px) dengan indikator panah _dropdown_ halus.
  - **Aturan Strict**: DILARANG menampilkan nama lengkap, nama kampus, atau jurusan langsung di baris Navbar. Detail pengguna HANYA boleh muncul di dalam _dropdown menu_ saat avatar diklik.

### 4.2 Refactoring Footer Section

- **Hapus Total**: Menghilangkan baris `JARINGAN MITRA KAMPUS: BINUS University • UI • ITB • UGM • ITS`.
- **Substansi Footer**: Menampilkan navigasi standar bersih (Link Menu Utama, Copyright NEXIERA 2026, serta Privacy Policy/Terms) tanpa menyertakan slogan atau klaim kemitraan institusi resmi.

---

## 📺 5. Fitur Halaman Profil Publik Penyelenggara & Tutor (Gaya Channel YouTube)

Sediakan halaman profil khusus tempat mahasiswa dapat melihat seluruh mata kuliah yang diterbitkan oleh satu penyelenggara/tutor tanpa perlu filter ulang di _search bar_:

1. **Profil Publik Bootcamp / Mitra (`/organizers/[slug]`)**
   - **Trigger**: Diklik dari Banner Carousel (misal: _Booster Academy_) atau Logo/Nama Mitra di _card_.
   - **Konten**: Header Banner Organisasi + Logo & Info Mitra + **Grid seluruh mata kuliah yang dibuka Mitra tersebut** (contoh: _Algoritma & Pemrograman_, _Data Structure_, _Kalkulus_).

2. **Profil Publik Peer-Tutoring (`/tutors/[slug]`)**
   - **Trigger**: Diklik dari foto avatar atau nama tutor di kartu _Peer-Tutoring_.
   - **Konten**: Profil Ringkas Tutor (Foto, Nama, Kampus, Jurusan, Bio) + **Grid seluruh kelas bimbingan yang dibuka tutor tersebut**.

---

## 🔍 6. Restrukturisasi Dropdown Filter & Kartu Kelas

### 6.1 Refactoring 3-Level Dropdown Filter (`/cari-kelas`)

Gantikan filter lama _"Bidang Keahlian"_ dengan 3 _dropdown_ terpisah yang presisi:

```
[ Dropdown 1: Kategori Utama ▾ ] ➔ [ Dropdown 2: Jurusan ▾ ] ➔ [ Dropdown 3: Mata Kuliah ▾ ]
```

1. **Dropdown 1 — Kategori Utama**:
   - _Opsi_: Sains & Teknologi, Ekonomi & Bisnis, Sosial & Hukum, Kesehatan & Kedokteran, Seni & Desain, Pertanian & Peternakan.
   - 🛑 _Aturan Strict_: "Computer Science" BUKAN Kategori Utama, melainkan nama Jurusan.

2. **Dropdown 2 — Jurusan**:
   - _Opsi_: Computer Science, Information Systems, Mobile Application & Technology, Cyber Security, Akuntansi, Manajemen, dll.

3. **Dropdown 3 — Mata Kuliah**:
   - _Opsi_: Algoritma & Pemrograman, Struktur Data, Rekayasa Perangkat Lunak, Kalkulus, dll.

### 6.2 Tampilan Struktur Kartu Kelas (`Class Card`)

- **Header Kartu**: Tampilkan nama **Kategori Utama** dalam teks kapital netral (contoh: `SAINS & TEKNOLOGI`), dengan subtext **Jurusan** di bawahnya (contoh: _Computer Science_).
- **Judul Mata Kuliah**: Tampilkan nama matkul secara murni tanpa kode matkul internal atau _placeholder_ (contoh: `Algorithm and Programming`).
- **Format Nama Tutor**: Tulis nama bersih mahasiswa tanpa gelar formal (contoh: `Kevin Sanjaya`).

---

## 📝 7. Form Buat Kelas & Pengelolaan Link Akses (`/buat-kelas`)

### 7.1 Field Tambahan Form Buat Kelas

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

### 7.2 Strict Conditional Rendering (Invisible Flow)

Setiap kelas menyimpan 3 jenis tautan pembelajaran:

> ⚠️ **Aturan Conditional Rendering (Invisible):**
>
> - **Link Catatan**: Jika `linkCatatan` tidak diisi tutor (`null` / `undefined` / `""`), komponen **WAJIB TIDAK DI-RENDER (`return null;`)**. DILARANG membuat tombol _disabled_ atau _placeholder_.
> - **Link Penyimpanan / Rekaman Sesi**: Jika `linkPenyimpanan` tidak diisi tutor, komponen **WAJIB TIDAK DI-RENDER (`return null;`)**.

---

## 🔄 8. Penyesuaian Alur Pendaftaran & Akses Dashboard

### 8.1 Penghapusan Access Hub Terkunci di Halaman Detail

- Hapus komponen _"Centralized Access Hub"_ (kotak link terkunci) dari halaman detail kelas publik (`/bootcamps/[slug]`).
- Halaman detail publik murni berfungsi sebagai katalog informasi (deskripsi matkul, silabus, jadwal, dan profil tim pengajar).

### 8.2 Alur Setelah Klik "Daftar Kelas"

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

## 📋 9. Matriks Ringkasan Perubahan UI & Logic

| Komponen / Fitur                 | ❌ Tampilan / Sistem Lama (AI Slop)                                             | ✅ Spesifikasi Baru (Refactored)                                                       |
| :------------------------------- | :------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------- |
| **Pill Badges Header**           | Floating badge hiasan acak (`Notion Hub`, `Terverifikasi`, `Verified BINUS CS`) | **Dihapus total**. Tampilan bersih & fungsional.                                       |
| **Profile Card Team**            | Memakai badge centang hijau `Verified BINUS CS`                                 | **Kartu profil bersih** hanya berisi Nama, Role, Jurusan, & Deskripsi.                 |
| **Social Proof Stats**           | Angka statistik palsu (`15.000+ Mahasiswa`, `4.9★`)                             | **Dihapus total**.                                                                     |
| **Footer Mitra Bar**             | `JARINGAN MITRA KAMPUS: BINUS • UI • ITB`                                       | **Dihapus total**. Footer murni navigasi & copyright.                                  |
| **Filter Catalog**               | "Semua Bidang Keahlian" bercampur                                               | 3 Dropdown: **Kategori Utama** $\rightarrow$ **Jurusan** $\rightarrow$ **Mata Kuliah** |
| **Identitas "Computer Science"** | Dianggap sebagai Kategori Utama                                                 | Dikategorikan dengan benar sebagai **Jurusan** di bawah _Sains & Teknologi_            |
| **Identitas Pengajar**           | Mencantumkan `S.Kom` & sebutan `Aslab`                                          | **Nama murni mahasiswa** tanpa gelar & tanpa istilah Aslab                             |
| **Mention Notion**               | "Notion Study Hub" di mana-mana                                                 | Diberikan nama netral **"Link Catatan"**                                               |
| **Link Rekaman Sesi**            | Belum memfasilitasi rekaman                                                     | Ditambahkan **Link Penyimpanan / Rekaman** (_Invisible_ jika kosong)                   |
| **Profile Navbar**               | Box lebar (Foto + Nama + Kampus + Jurusan)                                      | **Avatar Circle Ringkas** + Dropdown Menu saat diklik                                  |
| **Hero Section Right Area**      | Layout kanan meluap / merusak simetri teks                                      | **Presisi Container Grid** dengan pembatas rasio gambar (`object-contain`)             |
| **Akses Link Pembelajaran**      | Terkunci di halaman detail publik                                               | Dipindahkan sepenuhnya ke **Dashboard (`/kelas-saya`)**                                |
| **Profil Organisasi/Tutor**      | Harus cari lewat search bar satu per satu                                       | **Halaman Profil Publik** (Gaya Channel YouTube)                                       |
