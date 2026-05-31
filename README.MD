# Sistem Manajemen Perpustakaan (Library Management System)

Sistem Manajemen Perpustakaan berbasis web modern yang dibangun dengan menggunakan **Node.js**, **Express.js**, **EJS (Embedded JavaScript)**, dan **MongoDB Atlas**. Aplikasi ini dirancang untuk mempermudah proses administrasi perpustakaan, manajemen buku, serta peminjaman buku bagi para mahasiswa/anggota perpustakaan secara digital.

Aplikasi ini dilengkapi dengan antarmuka premium yang dinamis, mendukung **Mode Terang (Light Mode)** dan **Mode Gelap AMOLED (Dark Mode)** yang hemat energi dan ramah di mata, serta animasi mikro yang mulus.

---

## Fitur Utama

### 1. Sistem Autentikasi & Otorisasi
*   **JWT (JSON Web Token) via HTTP-Only Cookies**: Autentikasi aman yang melindungi data pengguna dari serangan XSS/CSRF.
*   **Password Hashing**: Menggunakan `bcryptjs` untuk mengamankan data sandi di database.
*   **Otorisasi Role**: Pembedaan hak akses yang ketat antara **Admin** dan **User**.
*   **Flash Messages**: Notifikasi pop-up dinamis di dalam card (khusus login/register) dan bagian atas halaman untuk memandu interaksi sukses/gagal pengguna.

### 2. Desain Premium & Manajemen Tema
*   **Default Light Theme**: Tampilan bersih, kontras tinggi, dan modern.
*   **AMOLED Dark Theme**: Tema hitam pekat premium yang dirancang agar **nyaman dan tidak menusuk mata** dengan menggunakan teks *off-white* (Zinc) dan panel obsidian gelap.
*   **Auto Save Theme**: Pilihan tema tersimpan secara otomatis menggunakan `localStorage`.

### 3. Dashboard Adaptif (Berdasarkan Role)
*   **Dashboard Admin**:
    *   Total koleksi buku di perpustakaan.
    *   Jumlah anggota (user) terdaftar.
    *   Buku yang sedang dipinjam secara aktif.
    *   Total kategori buku yang tersedia.
*   **Dashboard User**:
    *   Total koleksi buku perpustakaan.
    *   Jumlah buku yang sedang dipinjam secara aktif oleh dirinya.
    *   Jumlah riwayat buku yang sudah pernah dikembalikan.

### 4. Fitur Pengguna (User Portal)
*   **Daftar Buku & Detail Buku**: Melihat detail informasi buku seperti Judul, Penulis, Penerbit, Tahun Terbit, Kategori, ISBN, dan Sisa Stok.
*   **Peminjaman Buku**: Pengguna dapat meminjam buku secara langsung (sistem otomatis mengurangi stok buku).
*   **Pengembalian Buku**: Pengembalian buku yang sedang dipinjam (sistem otomatis menambah kembali stok buku).
*   **Buku Saya**: Halaman ringkasan berisi daftar buku yang saat ini sedang dipinjam secara aktif.
*   **Profil Pengguna**: Melihat dan mengedit informasi profil (Nama, Alamat, Nomor Telepon).

### 5. Fitur Admin (Admin Portal)
*   **Manajemen Buku (CRUD)**:
    *   Menambahkan buku baru.
    *   Mengubah detail informasi buku.
    *   Menghapus buku dari sistem.
*   **Kontrol Akses Penuh**: Melindungi seluruh halaman modifikasi data agar hanya bisa diakses oleh akun bertipe Admin.

---

## Teknologi & Pustaka (Tech Stack)

*   **Runtime**: [Node.js](https://nodejs.org/) (v18+)
*   **Framework Web**: [Express.js](https://expressjs.com/)
*   **Basis Data**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose ODM)
*   **Template Engine**: [EJS](https://ejs.co/) (Layouting: `express-ejs-layouts`)
*   **Autentikasi**: `jsonwebtoken` & `cookie-parser`
*   **Gaya & Desain**: Vanilla CSS Modern (Poppins Font, Google Material Icons, Responsive Flexbox/Grid, AMOLED Design System)

---

## Struktur Proyek (Directory Tree)

```text
project-kuliah-perpustakaan/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   ├── borrowController.js
│   └── profileController.js
│
├── middleware/
│   ├── auth.js
│   └── role.js
│
├── models/
│   ├── Book.js
│   ├── Borrow.js
│   └── User.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── borrowRoutes.js
│   └── profileRoutes.js
│
├── views/
│   ├── auth/
│   ├── books/
│   ├── layouts/
│   ├── partials/
│   ├── dashboard.ejs
│   └── profile.ejs
│
├── .env
├── app.js
├── create-admin.js
├── package.json
└── server.js
```

---

## Daftar Endpoint API

Sistem memiliki beberapa kelompok rute endpoint yang diatur berdasarkan modul fungsinya:

### 1. Autentikasi (`/auth`)
Seluruh endpoint pada kelompok ini dapat diakses secara publik (kecuali logout yang memerlukan status login).

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/auth/login` | Menampilkan halaman form login | Publik |
| `POST` | `/auth/login` | Memproses masuk akun (User / Admin) | Publik |
| `GET` | `/auth/register` | Menampilkan halaman form registrasi | Publik |
| `POST` | `/auth/register` | Memproses pendaftaran akun baru (User) | Publik |
| `GET` | `/auth/logout` | Menghapus token autentikasi (Logout) | Terautentikasi |

### 2. Dashboard (`/`)
Rute utama aplikasi yang mengarahkan ke halaman ringkasan informasi sesuai hak akses.

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Redirect ke `/dashboard` jika masuk, jika tidak ke `/auth/login` | Publik |
| `GET` | `/dashboard` | Menampilkan ringkasan statistik (adaptif sesuai role) | Terautentikasi |

### 3. Manajemen Buku (`/books`)
Digunakan untuk melihat, mencari, dan mengelola koleksi buku perpustakaan.

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | Menampilkan daftar seluruh buku (dan pencarian) | Terautentikasi |
| `GET` | `/books/detail/:id` | Menampilkan informasi detail dari satu buku | Terautentikasi |
| `GET` | `/books/add` | Menampilkan formulir penambahan buku baru | **Admin Only** |
| `POST` | `/books/add` | Memproses penambahan buku baru ke database | **Admin Only** |
| `GET` | `/books/edit/:id` | Menampilkan formulir pengeditan data buku | **Admin Only** |
| `POST` | `/books/edit/:id` | Memproses pembaruan data buku | **Admin Only** |
| `POST` | `/books/delete/:id` | Menghapus buku dari sistem perpustakaan | **Admin Only** |

### 4. Transaksi Peminjaman Buku (`/borrow`)
Digunakan untuk mengelola siklus peminjaman dan pengembalian buku.

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `POST` | `/borrow/:bookId` | Melakukan peminjaman buku berdasarkan ID buku | **User Only** |
| `POST` | `/borrow/return/:id` | Mengembalikan buku berdasarkan ID transaksi peminjaman | **User Only** |
| `GET` | `/borrow/mybooks` | Menampilkan riwayat dan daftar buku yang sedang dipinjam | **User Only** |

### 5. Profil Pengguna (`/profile`)
Digunakan untuk mengelola data akun pengguna saat ini.

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile` | Menampilkan data profil pengguna saat ini | Terautentikasi |
| `POST` | `/profile/edit` | Memproses pembaruan informasi profil | Terautentikasi |

---

## Panduan Instalasi & Penggunaan

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal **Node.js** dan memiliki akses ke basis data **MongoDB** (baik MongoDB Local maupun Cloud Atlas).

### 2. Kloning / Dapatkan Project
Masuk ke direktori utama project perpustakaan:
```bash
cd project-kuliah-perpustakaan
```

### 3. Instal Dependensi
Pasang semua pustaka yang dibutuhkan menggunakan NPM:
```bash
npm install
```

### 4. Konfigurasi Lingkungan (`.env`)
Buat atau ubah file `.env` di direktori utama, lalu isi dengan konfigurasi MongoDB Atlas dan JWT Secret Anda:
```env
MONGODB_URI=mongodb://username:password@cluster-url.../nama_db?options...
JWT_SECRET=rahasia_jwt_sangat_panjang_dan_aman_anda
PORT=3000
```

### 5. Buat Akun Admin Pertama Anda
Jalankan skrip utilitas otomatis untuk membuat akun Administrator di database Anda:
```bash
node create-admin.js
```
*   **Default Admin Email**: `admin@perpustakaan.com`
*   **Default Admin Password**: `admin123password`
*(Anda juga dapat mengedit isi berkas [create-admin.js](create-admin.js) untuk mengubah alamat email dan password admin sesuai selera).*

### 6. Jalankan Server
*   **Mode Pengembangan (dengan Nodemon auto-restart)**:
    ```bash
    npm run dev
    ```
*   **Mode Produksi**:
    ```bash
    npm start
    ```

Server akan aktif dan dapat diakses di browser pada alamat **[http://localhost:3000](http://localhost:3000)**.

---

## Keamanan & Validasi Sistem

1.  **Strict Route Guard**: Middleware `protect` akan memblokir setiap pengguna tidak terdaftar yang mencoba menerobos halaman internal.
2.  **Admin Otorisasi**: Middleware `authorizeRole('admin')` mengamankan seluruh API/rute untuk Tambah, Edit, dan Hapus Buku agar tidak disalahgunakan oleh pengguna biasa.
3.  **Validation Check**: Input peminjaman divalidasi silang untuk mencegah peminjaman buku yang sama berulang kali sebelum dikembalikan, serta mencegah peminjaman jika persediaan stok buku di perpustakaan bernilai `0`.

---
