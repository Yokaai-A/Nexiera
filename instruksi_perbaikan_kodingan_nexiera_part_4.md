# **Spesifikasi Teknis & Panduan Kodingan NEXIERA (Part 4)**
Dokumen panduan implementasi teknis untuk refaktorisasi UI/UX, penataan ulang navigasi, sistem Dashboard CRM multi-peran, verifikasi OTP email kampus, serta persiapan abstraksi *backend* pada platform NEXIERA.

---

## **1. Perbaikan Dark Mode & Kontras Visual**

### **A. Aturan Pewarnaan Utama**
* **Brand Color**: Kunci warna utama pada **Solid Blue `#2563EB`** (Tailwind: `bg-blue-600` / `text-blue-600`), konsisten di *Light Mode* maupun *Dark Mode*.
* **Kontras Teks Tombol**:
  * Semua tombol berlatar biru (`bg-[#2563EB]`) **wajib menggunakan teks putih solid** (`text-white`), baik di *light mode* maupun *dark mode*.
  * Jangan gunakan warna font gelap (`text-slate-900`) di dalam tombol atau badge yang berlatar biru.

### **B. Kartu & Komponen (Dark Mode)**
* Gunakan latar belakang netral gelap: `dark:bg-slate-900` atau `dark:bg-zinc-900`.
* Tambahkan border tipis dengan kontras rendah: `dark:border-slate-800`.
* Pastikan warna teks deskripsi menggunakan `dark:text-slate-300` agar terbaca dengan jelas di atas latar gelap.

---

## **2. Navigasi Utama (Navbar) & Aksesibilitas**

### **A. Struktur Menu Navbar Publik**
Restrukturisasi navigasi utama pada `/components/Navbar.tsx`:
* **Menu Tengah (Publik)**:
  * `Home` (`/`)
  * `Cari Kelas` (`/cari-kelas`)
  * `Tentang Kami` (`/tentang-kami`)
* **Menu Kanan (Area Utilitas)**:
  * **Toggle Dark Mode**: Icon button (🌙 / ☀️) diletakkan di sebelah kiri ikon Notifikasi.
  * **Notifikasi**: Lonceng notifikasi.
  * **Tombol Akses CRM**: 
    * UBAH label menu `Kelas Saya` di navbar menjadi **`Dashboard`** (mengarahkan ke `/dashboard`).
    * HAPUS tombol `Buat Kelas` dari navbar publik. Fitur pembuatan kelas hanya diakses melalui **Dashboard Pengajar**.

### **B. Proteksi Rute (Route Guard `/buat-kelas`)**
* Jika pengguna belum login (Guest) mencoba mengakses `/buat-kelas`, arahkan langsung ke modal/halaman Login.
* Jika pengguna dengan akun *Student* biasa (belum terverifikasi sebagai Tutor/Mitra) mengakses `/buat-kelas`, tampilkan modal penolakan dengan opsi:
  > *"Fitur ini khusus untuk Peer-Tutor dan Mitra Bootcamp Terverifikasi."*
  > `[ Ajukan Verifikasi Pengajar ]`

---

## **3. Arsitektur Dashboard CRM Multi-Peran (`/dashboard`)**

### **A. Tampilan Mode Student (Mahasiswa)**
* **Sidebar Menu**:
  * `Dashboard / Ringkasan`
  * `Kelas Saya` (`/dashboard/kelas-saya`)
  * `Jadwal Bimbingan`
  * `Target Matkul UTS/UAS`
* **Penyesuaian Card Kelas Aktif**:
  * Ubah label tombol `+ Tambah Kelas` pada header halaman menjadi **`Cari Kelas Lainnya`** (mengarahkan ke `/cari-kelas`).
  * Pertahankan komponen **Akses Pembelajaran Langsung** (`Masuk Link GMEET` & `Link Catatan`). Gunakan rendering kondisional tersembunyi jika link tidak diisi oleh tutor.

### **B. Tampilan Mode Tutor & Bootcamp (Penyelenggara)**
* **Sidebar Menu**:
  * `Ringkasan & Performa`
  * `Kelola Kelas` (`/dashboard/tutor/kelas`)
  * `Buat Kelas Baru` (`/dashboard/tutor/buat-kelas`)
  * `Data Peserta CRM` (`/dashboard/tutor/peserta`)
  * `Profil Penyelenggara` (`/dashboard/tutor/profil`)
* **Restriksi Form Pembuatan Kelas**:
  * **Akun Peer-Tutor (Individu)**: Opsi tipe kelas otomatis terkunci pada `Peer-Tutoring`.
  * **Akun Mitra Bootcamp (Organisasi)**: Opsi tipe kelas dapat memilih `Bootcamp` atau `Peer-Tutoring`.

### **C. Mekanisme Tombol "CHANGE" Role pada Sidebar**
Komponen box status role di sidebar (`/components/dashboard/SidebarRoleBox.tsx`):
1. **Kondisi Pengguna Terverifikasi**: Klik tombol **CHANGE** langsung memicu *dropdown switch* untuk berganti mode tampilan (`Student` $\leftrightarrow$ `Peer-Tutor` / `Mitra Bootcamp`).
2. **Kondisi Pengguna Biasa (Student)**: Klik tombol **CHANGE** memicu modal popup pendaftaran:
   * **Opsi 1**: *Daftar Peer-Tutor (Individu)*
   * **Opsi 2**: *Daftar Mitra Bootcamp (Organisasi)*

---

## **4. Form Informasi Akademik & Verifikasi OTP Email Kampus**

### **A. Pembersihan Form Informasi Akademik**
Refaktor komponen form akademik (`/components/profile/AcademicProfileForm.tsx`):
* Ubah judul form dari *"Lengkapi Profil Akademik"* menjadi **"Informasi Akademik"**.
* **HAPUS** teks klaim kemitraan kampus: `Didukung penuh integrasi modul kurikulum BINUS University`.
* **HAPUS** klaim badge verifikasi otomatis hanya dari pengisian input teks NIM.
* Ubah teks deskripsi box info menjadi: *"Profil akademikmu akan disesuaikan dengan kurikulum mata kuliah kampus pilihanmu."*

### **B. Sistem Verifikasi OTP Email Kampus (`@binus.ac.id`)**
* **Pengguna Gmail Biasa (`@gmail.com`)**:
  * Tetap bisa mendaftar dan menggunakan platform sebagai *Learner*.
  * Fitur mengajukan diri sebagai Tutor/Mitra terkunci hingga email kampus dihubungkan.
* **Alur Verifikasi OTP**:
  1. Pengguna memasukkan email kampus (misal: `nama@binus.ac.id` / `nama@binus.edu`).
  2. Sistem memicu pengiriman 6 digit kode OTP ke email tersebut (simulasi di frontend).
  3. Setelah kode OTP valid, flag `isVerifiedCampusEmail` di state user diubah menjadi `true`, dan badge **Mahasiswa Terverifikasi** diaktifkan.

---

## **5. Abstraksi Layer Service Mock API & Global State**

Buat folder abstraksi `/lib/api/` agar siap diintegrasikan dengan *backend* di masa mendatang tanpa mengubah komponen UI.

### **A. Model Global State User (`/store/useUserStore.ts` atau React Context)**
```typescript
interface UserState {
  id: string;
  name: string;
  email: string;
  emailType: 'campus' | 'personal';
  isVerifiedCampusEmail: boolean;
  role: 'student' | 'tutor' | 'bootcamp_partner';
  activeViewRole: 'student' | 'tutor' | 'bootcamp_partner';
  university?: string;
  major?: string;
  nim?: string;
  setRole: (role: 'student' | 'tutor' | 'bootcamp_partner') => void;
  setActiveViewRole: (role: 'student' | 'tutor' | 'bootcamp_partner') => void;
}
```

### **B. Service Mock API (`/lib/api/authService.ts`)**
```typescript
export const authService = {
  sendCampusEmailOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    // Simulasi penundaan jaringan
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!email.endsWith('@binus.ac.id') && !email.endsWith('@binus.edu')) {
      throw new Error('Email harus menggunakan domain resmi kampus (@binus.ac.id)');
    }
    return { success: true, message: 'Kode OTP 6 digit telah dikirim ke email kampus Anda.' };
  },

  verifyCampusOtp: async (email: string, otp: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (otp === '123456' || otp.length === 6) {
      return { success: true };
    }
    throw new Error('Kode OTP tidak valid.');
  },

  submitTutorApplication: async (payload: {
    ktmFileUrl?: string;
    transcriptUrl?: string;
    type: 'peer_tutor' | 'bootcamp_partner';
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, status: 'pending_review' };
  }
};
```

---

## **6. Rangkuman Target File untuk Direfaktur**

| File Path | Fokus Perubahan |
| :--- | :--- |
| `components/Navbar.tsx` | Ubah menu `Kelas Saya` $\rightarrow$ `Dashboard`, pindah Dark Mode toggle, hapus `Buat Kelas` publik. |
| `app/buat-kelas/page.tsx` | Tambahkan *route guard* / modal proteksi khusus Tutor & Partner terverifikasi. |
| `app/dashboard/layout.tsx` | Implementasi sidebar CRM multi-role dan tombol **CHANGE** role switcher dengan modal verifikasi. |
| `components/profile/AcademicProfileForm.tsx` | Hapus teks klaim kemitraan kampus, ubah judul ke "Informasi Akademik", integrasikan modal OTP email kampus. |
| `lib/api/authService.ts` | Buat layer simulasi fungsi OTP dan pengajuan verifikasi tutor. |
| `store/useUserStore.ts` | Tambahkan status `isVerifiedCampusEmail` dan logika sakelar `activeViewRole`. |