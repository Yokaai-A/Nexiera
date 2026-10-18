# **Spesifikasi Perbaikan Layout & Fitur NEXIERA**

Panduan dan aturan perbaikan UI/UX platform NEXIERA untuk menyempurnakan hirarki pencarian, menyelaraskan pilar nilai utama, dan merapikan keterbacaan layout profil penyelenggara.

---

# **1\. Filter Pencarian Katalog: Penambahan Dropdown "Pilihan Kampus"**

## **Masalah Saat Ini**

Filter pencarian kelas di katalog utama saat ini hanya memiliki 3 dropdown level (`1. KATEGORI UTAMA`, `2. JURUSAN`, `3. MATA KULIAH`). Karena NEXIERA dirancang untuk mencakup mahasiswa dari berbagai perguruan tinggi, dibutuhkan filter kustom tingkat teratas untuk memilih institusi kampus.

## **Spesifikasi & Struktur Perbaikan**

* **Tambahkan Dropdown Level 1: Kampus** di posisi paling kiri sebelum Kategori Utama.  
* **Hirarki Filter Dropdown 4-Tingkat Baru**:

| Level | Filter Dropdown | Nilai Default | Opsi Pilihan (Contoh) |
| :---- | :---- | :---- | :---- |
| **Level 1** | **KAMPUS** | `Semua Kampus` | BINUS University, Universitas Indonesia, ITB, UGM, dll. |
| **Level 2** | **KATEGORI UTAMA** | `Semua Kategori Utama` | Sains & Teknologi, Bisnis & Manajemen, Seni & Desain, dll. |
| **Level 3** | **JURUSAN** | `Semua Jurusan` | Computer Science, Information Systems, Manajemen, dll. |
| **Level 4** | **MATA KULIAH** | `Semua Mata Kuliah` | Algorithm and Programming, Data Structures, Kalkulus, Software Engineering, dll. |

* **Layout Grid UI**:  
  * Ubah container grid filter dari 3 kolom menjadi **4 kolom responsif** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`).  
  * Sediakan tombol `Reset Filter` dan pemicu tipe kelas (`Semua Tipe`, `Bootcamp`, `Peer-Tutoring`) serta biaya (`Semua Biaya`, `Gratis`, `Berbayar`) di bawah baris 4 dropdown.

---

# **2\. Poin Pilar Pembelajaran Landing Page & Tentang Kami**

## **Masalah Saat Ini**

Pada bagian *"Pilar Pembelajaran / Mengapa NEXIERA Berbeda?"* di Landing Page dan Halaman Tentang Kami, pilar ke-2 tertulis *"Catatan Belajar Terstruktur"*. Hal ini membuat narasi platform berulang kali berfokus pada catatan, padahal fokus utama NEXIERA adalah marketplace bimbingan belajar akademik & pemahaman mata kuliah kampus.

## **Spesifikasi & Struktur Perbaikan**

1. **Ganti Pilar Ke-2**: Hapus pilar *"Catatan Belajar Terstruktur"* dari pilar pembelajaran utama.  
2. **Ganti dengan Fokus Akademik & Persiapan Ujian**:  
   * **Pilar 1: 100% Khusus Matkul Kampus**  
     * *Deskripsi*: Fokus penuh pada mata kuliah kurikulum akademik kampus (seperti AlgoProg, ADA, Kalkulus, Software Engineering, Basis Data) agar mahasiswa menemukan bimbingan yang presisi dengan silabus perkuliahan mereka.  
   * **Pilar 2: Persiapan Ujian & Pemahaman Akademik** *(PENGGANTI BARU)*  
     * *Deskripsi*: Pendalaman konsep fundamental, pembedahan silabus perkuliahan, dan latihan soal terarah untuk persiapan UTS & UAS guna membantu peningkatan IPK dan rasa percaya diri akademis mahasiswa.  
   * **Pilar 3: Tutor Sebaya yang Relevan**  
     * *Deskripsi*: Bimbingan oleh mahasiswa tingkat atas berprestasi dan mitra pengajar yang memahami tantangan serta ritme perkuliahan dari pengalaman langsung.  
3. **Aturan Pengembang (Anti-AI Slop)**: Hentikan penekanan berlebihan atau penyebutan berulang mengenai "catatan belajar" di pilar utama Landing Page & Tentang Kami.

---

# **3\. Perbaikan Layout Header Profil Penyelenggara**

## **Masalah Saat Ini**

Pada halaman Profil Penyelenggara (Bootcamp / Peer-Tutoring), teks informasi (Badge Penyelenggara, Nama Penyelenggara, Tagline/Deskripsi, dan 3 poin metadata) saat ini menumpuk di atas gambar banner latar belakang (background header gelap/berpola). Hal ini mengakibatkan teks sulit dibaca (*low contrast / unreadable*).

## **Spesifikasi & Struktur Perbaikan Layout**

* **Banner Header**:  
  * Gambar banner/cover bagian atas harus **bersih dari teks overlay**.  
  * Tidak ada baris nama, deskripsi, atau badge yang menimpa banner gambar.  
* **Penataan Elemen di Area Konten Putih**:  
  * Pindahkan seluruh baris teks dan metadata ke bawah banner pada container berlatar putih (*clean white card section*).  
* **Urutan Tata Letak Komponen dari Atas ke Bawah**:  
  1. **\[Atas\] Cover Banner Header**: Banner visual latar belakang murni.  
  2. **\[Tengah/Batas\] Logo Box**: Avatar/Logo penyelenggara dalam container kotak putih presisi dengan border tipis (posisi menumpang/overlay rapi di garis batas banner dan card).  
  3. **\[Bawah Logo \- Dalam Container Putih\]**:  
     * **Baris 1**: Badge Tipe Penyelenggara (Contoh: `🚀 Mitra Bootcamp Akademik` atau `🤝 Peer-Tutor Mandiri`).  
     * **Baris 2**: Nama Penyelenggara / Bootcamp dalam ukuran font besar & tegas (Contoh: **Booster Academy**).  
     * **Baris 3**: Tagline / Deskripsi Ringkas Penyelenggara (Contoh: *"Mitra Belajar & Bimbingan Intensif Mahasiswa Kampus"*).  
     * **Baris 4**: Baris Metadata 3 Poin Terstruktur dengan Ikon/Pemisah yang Jelas:  
       * 📍 `BINUS University`  
       * 📅 `Berdiri Sejak 2026`  
       * 📚 `3 Mata Kuliah Dibuka`  
     * **Baris 5**: Tombol Aksi Utama (Contoh: `🔍 Cari Kelas Lainnya`).

---

# **4\. Rangkuman & Catatan Implementasi**

* Seluruh spesifikasi di atas wajib diimplementasikan pada komponen Next.js:  
  * `/app/cari-kelas`  
  * `/app/tentang-kami`  
  * `/app/profil-penyelenggara`  
* Desain tetap mempertahankan skema warna **Solid Blue `#2563EB`**, 2D flat, tanpa gradien, tanpa badge verifikasi palsu, dan mengutamakan kebersihan visual (editorial anti-AI slop).

