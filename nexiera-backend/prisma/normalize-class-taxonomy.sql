UPDATE `classes`
SET
  `title` = CASE `slug`
    WHEN 'kalkulus-1-dan-aljabar-linier' THEN 'Aljabar Linear'
    WHEN 'bootcamp-pemrograman-berorientasi-objek' THEN 'Object Oriented Programming'
    ELSE `title`
  END,
  `bannerUrl` = CASE `slug`
    WHEN 'struktur-data-dan-algoritma' THEN '/images/courses/data-structures.svg'
    WHEN 'kalkulus-1-dan-aljabar-linier' THEN '/images/courses/calculus.svg'
    WHEN 'sistem-basis-data' THEN '/images/courses/database-systems.svg'
    WHEN 'pengantar-akuntansi-keuangan' THEN '/images/courses/accounting.svg'
    WHEN 'bootcamp-pemrograman-berorientasi-objek' THEN '/images/courses/oop.svg'
    ELSE `bannerUrl`
  END,
  `category` = CASE `slug`
    WHEN 'pengantar-akuntansi-keuangan' THEN 'Ekonomi & Bisnis'
    ELSE 'Sains & Teknologi'
  END,
  `major` = CASE `slug`
    WHEN 'sistem-basis-data' THEN 'Sistem Informasi'
    WHEN 'pengantar-akuntansi-keuangan' THEN 'Akuntansi'
    ELSE 'Teknik Informatika'
  END,
  `campusTarget` = CASE `slug`
    WHEN 'struktur-data-dan-algoritma' THEN 'BINUS University'
    WHEN 'kalkulus-1-dan-aljabar-linier' THEN 'BINUS University'
    WHEN 'sistem-basis-data' THEN 'Universitas Indonesia'
    WHEN 'pengantar-akuntansi-keuangan' THEN 'Universitas Indonesia'
    WHEN 'bootcamp-pemrograman-berorientasi-objek' THEN NULL
  END
WHERE `slug` IN (
  'struktur-data-dan-algoritma',
  'kalkulus-1-dan-aljabar-linier',
  'sistem-basis-data',
  'pengantar-akuntansi-keuangan',
  'bootcamp-pemrograman-berorientasi-objek'
);

UPDATE `users`
SET `major` = CASE `major`
  WHEN 'Computer Science' THEN 'Teknik Informatika'
  WHEN 'Information Systems' THEN 'Sistem Informasi'
  WHEN 'Software Engineering' THEN 'Rekayasa Perangkat Lunak'
  WHEN 'Data Science' THEN 'Sains Data'
  WHEN 'Cyber Security' THEN 'Keamanan Siber'
  WHEN 'Game Application and Technology' THEN 'Teknologi Permainan'
  WHEN 'Business Management' THEN 'Manajemen'
  WHEN 'Accounting & Finance' THEN 'Akuntansi'
  WHEN 'Industrial Engineering' THEN 'Teknik Industri'
  ELSE `major`
END
WHERE `major` IN (
  'Computer Science',
  'Information Systems',
  'Software Engineering',
  'Data Science',
  'Cyber Security',
  'Game Application and Technology',
  'Business Management',
  'Accounting & Finance',
  'Industrial Engineering'
);

UPDATE `users`
SET
  `email` = 'rafi.pratama@student.ac.id',
  `fullName` = 'Rafi Pratama',
  `campus` = 'BINUS University',
  `major` = 'Teknik Informatika',
  `organizationName` = 'Booster Academy',
  `organizationLogoUrl` = '/Logo_Akhir.png',
  `contactEmail` = 'info@boosteracademy.id',
  `headline` = 'Mahasiswa Teknik Informatika & Pengelola Mitra Bootcamp',
  `bio` = 'Mahasiswa BINUS University yang mengelola program bimbingan akademik Booster Academy.',
  `avatarUrl` = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  `activeRole` = 'MITRA_BOOTCAMP',
  `roles` = '["MAHASISWA", "PEER_TUTOR", "MITRA_BOOTCAMP"]'
WHERE `email` = 'booster@student.com';
