# **Spesifikasi Teknis & Panduan Kodingan Refaktorisasi NEXIERA (Part 6)**

Dokumen spesifikasi ini berisi instruksi teknis yang sangat ketat (*strict guidelines*) untuk menangani arsitektur Multi-Role, refaktorisasi modal verifikasi pengajar, pemisahan halaman pengaturan personal vs. dashboard, restriksi form buat kelas, serta perbaikan *conditional rendering* verifikasi email.

---

## **1. Arsitektur Multi-Role Pengguna (Array-Based Role Model)**

### **A. Aturan Dasar & Inisialisasi Akun**
1. **Default Status Akun Baru**:
   - Seluruh pengguna baru yang terdaftar (baik via Google OAuth maupun Email) **100% wajib otomatis berstatus `student` saja**.
   - Peran `tutor` maupun `bootcamp` **TIDAK BOLEH** langsung aktif atau terdaftar secara otomatis di awal.

2. **Perubahan State Model (`/store/useUserStore.ts`)**:
   - DILARANG menggunakan variabel string tunggal (`role: string`) yang menyebabkan penimpaan status (*override*).
   - Gunakan struktur array untuk menampung seluruh peran yang dimiliki pengguna, serta satu variabel penanda mode antarmuka yang sedang aktif.

```typescript
interface UserState {
  id: string;
  name: string;
  email: string;
  isVerifiedCampusEmail: boolean;
  
  // Array menampung seluruh peran yang sudah terverifikasi
  roles: Array<'student' | 'tutor' | 'bootcamp'>; 
  
  // Tampilan mode dashboard/antarmuka yang sedang dibuka saat ini
  activeRole: 'student' | 'tutor' | 'bootcamp'; 
  
  // Fungsi penambah role baru tanpa menghapus role yang sudah ada
  addRole: (newRole: 'tutor' | 'bootcamp') => void;
  setActiveRole: (role: 'student' | 'tutor' | 'bootcamp') => void;
}
```

3. **Logika Pendaftaran Role Baru**:
   - Saat pengguna menyelesaikan verifikasi `tutor` atau `bootcamp`, panggil `addRole(newRole)` untuk menambahkan nilai baru ke dalam array `roles`.
   - DILARANG MENGHAPUS nilai `'student'` dari array `roles`. Satu akun bisa memiliki `roles: ['student', 'tutor', 'bootcamp']`.

4. **Mekanisme Tombol CHANGE Role (Sidebar Dashboard)**:
   - Jika pengguna mengklik tombol **CHANGE**:
     - Tampilkan pilihan *switch* hanya untuk role yang **sudah ada di dalam array `roles`**.
     - Jika pengguna memilih role yang **belum ada di array `roles`**, tampilkan modal pendaftaran/verifikasi.

---

## **2. Refaktor Modal Verifikasi Pengajar (Alur 1)**

### **A. Penyederhanaan Form Peer-Tutor (Alur 1)**
Refaktor komponen modal verifikasi (`/components/modals/TeacherVerificationModal.tsx`):

1. **Hapus Input Manual Matkul & Nilai**:
   - Hapus input dropdown *"Mata Kuliah Terkait yang Ingin Diajarkan"*.
   - Hapus input dropdown *"Nilai Transkrip pada Mata Kuliah Terkait"*.
2. **Persyaratan Berkas**:
   - Wajib unggah **KTM Aktif** (`pdf`, `jpg`, `png`).
   - Wajib unggah **Transkrip Nilai Resmi Akademik** (`pdf`).
3. **Pembersihan Teks & Netralisasi Nama File**:
   - Hapus istilah spesifik seperti *"SIAKAD"* atau nama kampus tertentu.
   - Ubah contoh nama file dummy menjadi netral: `transkrip_akademik_resmi.pdf` dan `ktm_aktif.pdf`.

### **B. Form Dinamis Tab Mitra Bootcamp**
- Saat pengguna berpindah tab dari **Peer-Tutor** ke **Mitra Bootcamp**:
  - Sembunyikan form transkrip perorangan.
  - Tampilkan form data organisasi: **Nama Organisasi/Bootcamp**, **Logo Organisasi**, **Kontak Penanggung Jawab**, dan **KTM/ID Penanggung Jawab**.

---

## **3. Pemisahan Halaman Pengaturan (Personal vs. Dashboard)**

Arsitektur halaman pengaturan dibagi menjadi **dua lokasi terpisah dengan fungsi berbeda**:

### **A. Halaman Pengaturan Akun Personal (`/pengaturan` - Luar Dashboard)**
*Halaman khusus pengurusan identitas diri pengguna sebagai individu.*
- **Lokasi Rute**: `/pengaturan` (Diakses dari dropdown foto profil navbar utama).
- **Cakup Modul**:
  1. Update Nama Lengkap, Bio Diri, dan Foto Profil Personal.
  2. Ubah Alamat Email Terhubung.
  3. Form Verifikasi OTP Email Kampus (`@binus.ac.id` / `@binus.edu`).

### **B. Halaman Pengaturan Profil Bimbingan (`/dashboard/tutor/pengaturan` - Dalam Dashboard)**
*Halaman khusus pengurusan identitas publik pengajar atau lembaga.*
- **Lokasi Rute**: `/dashboard/tutor/pengaturan` atau `/dashboard/bootcamp/pengaturan`.
- **Cakup Modul**:
  1. Update Logo Resmi Organisasi / Foto Publik Pengajar.
  2. Upload & Ganti **Cover Banner Sampul Publik**.
  3. Deskripsi Singkat Tim / Pengajar dan Lokasi Kampus Utama.

---

## **4. Kustomisasi Visual & Pembersihan Preset**

Refaktor komponen kustomisasi gambar (`/components/profile/ProfileCustomizationSection.tsx`):

### **A. Cover Banner Sampul Publik**
1. **HAPUS SEMUA PRESET GAMBAR**: Hapus tombol pilihan preset seperti *"Perpustakaan & Kampus"*, *"Lab Komputer Modern"*, dll.
2. **Default Background**: Jika pengguna belum mengunggah banner, tampilkan latar belakang warna solid netral/acak (`random solid color background`).
3. **Tombol Aksi**: Hanya sediakan satu tombol utama `Unggah Gambar Banner Baru`.

### **B. Foto Profil / Logo**
1. **HAPUS SEMUA PRESET AVATAR**: Hapus tombol preset foto seperti *"Mahasiswa 1"*, *"Mahasiswa 2"*, *"Bootcamp Logo"*, dll.
2. **Default Placeholder**: Jika belum ada foto diunggah, gunakan **Ikon Vektor Orang/User Berwarna Abu-abu (`grey user vector icon`)**.
3. **Tombol Aksi**: Hanya sediakan satu tombol utama `Unggah Foto Profil` (atau `Unggah Logo` jika mode Bootcamp).

---

## **5. Restriksi Pembuatan Kelas Khusus Mode Bootcamp**

Refaktor form buat kelas (`/app/dashboard/tutor/buat-kelas/page.tsx`):

1. **Restriksi Tipe Kelas (Strict Locking)**:
   - Jika `activeRole === 'bootcamp'`:
     - Tipe kelas **OTOMATIS TERKUNCI** pada opsi **`Bootcamp`**.
     - Pilihan `Peer-Tutoring` **DILARANG BISA DIKLIK / DISABLED**.

2. **Autofill & Lock Nama Organisasi**:
   - Field input "Nama Penyelenggara / Organisasi" **otomatis terisi (`auto-fill`)** mengambil data dari Pengaturan Bootcamp.
   - Set atribut input menjadi **`read-only` / `disabled`** agar nama organisasi tidak bisa diganti secara acak saat membuat kelas.

---

## **6. Logic Conditional & Pembersihan Teks Verifikasi Email**

Refaktor modul verifikasi email pada `/app/pengaturan/page.tsx`:

### **A. Alur Login & Verifikasi**
1. Pengguna dapat login pertama kali menggunakan **Google OAuth (`@gmail.com`)** untuk menjelajah sebagai *Learner*.
2. Pengguna dapat mendaftar kelas biasa tanpa wajib verifikasi email kampus di awal.
3. Verifikasi email kampus dipicu saat pengguna ingin mendaftar sebagai Tutor/Bootcamp atau menautkan email resmi di `/pengaturan`.

### **B. Strict Conditional Rendering Form OTP**
Gunakan logika kondisional berikut pada komponen verifikasi email:

```tsx
// Jika email sudah terverifikasi sebagai email kampus
{isVerifiedCampusEmail ? (
  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
    <p className="font-medium">✓ Email Kampus Anda Telah Terverifikasi</p>
    <p className="text-sm opacity-90">{userEmail}</p>
  </div>
) : (
  /* Tampilkan Form Input OTP HANYA jika BELUM terverifikasi */
  <div className="space-y-4">
    <label className="block text-sm font-medium">Masukkan Email Kampus Anda:</label>
    <div className="flex gap-2">
      <input 
        type="email" 
        placeholder="nama@binus.ac.id" 
        className="input-style"
      />
      <button className="btn-primary">Kirim Kode OTP</button>
    </div>
  </div>
)}
```

### **C. Pembersihan Teks & Label**
- Ubah label tombol `Kirim 6-Digit OTP Simulasi` $\rightarrow$ **`Kirim Kode OTP`**.
- Ubah subjudul `(@BINUS.AC.ID / @BINUS.EDU)` $\rightarrow$ **`(Domain Email Resmi Kampus)`**.
- Ubah deskripsi `untuk mendapatkan badge verifikasi` $\rightarrow$ **`untuk memverifikasi status mahasiswa aktif`**.

---

## **7. Ringkasan File Target & Tindakan Refaktorisasi**

| File Target | Action Required |
| :--- | :--- |
| `store/useUserStore.ts` | Ubah `role: string` menjadi `roles: Array<string>` dan tambahkan `activeRole`. Buat `activeRole` default = `'student'`. |
| `components/modals/TeacherVerificationModal.tsx` | Hapus input matkul/nilai perorangan. Buat tab dinamis Peer-Tutor vs Bootcamp. Hapus kata SIAKAD & nama kampus spesifik. |
| `app/pengaturan/page.tsx` | **[FILE BARU / TERPISAH]** Halaman pengaturan akun personal (foto, email, verifikasi OTP kampus). Implements conditional OTP rendering. |
| `app/dashboard/tutor/pengaturan/page.tsx` | Halaman pengaturan profil bimbingan dashboard (upload logo & cover banner tanpa preset images). |
| `app/dashboard/tutor/buat-kelas/page.tsx` | Lock tipe kelas ke `Bootcamp` saat `activeRole === 'bootcamp'`. Lock & auto-fill nama organisasi. |
| `components/profile/ProfileCustomizationSection.tsx` | Hapus semua preset gambar banner & avatar. Set default grey icon & random solid color. |
