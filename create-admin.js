require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Terhubung ke MongoDB Atlas...');

    const email = 'admin@perpustakaan.com';
    const password = 'admin123password'; // minimal 6 karakter
    const nama = 'Administrator';

    // Cari apakah email admin ini sudah terdaftar
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // Jika sudah ada, pastikan role-nya diubah jadi admin
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`\n==================================================`);
      console.log(`✅ BERHASIL: User dengan email "${email}" telah dipromosikan menjadi ADMIN!`);
      console.log(`==================================================\n`);
    } else {
      // Jika belum ada, buat akun baru
      await User.create({
        nama,
        email: email.toLowerCase(),
        password,
        role: 'admin'
      });
      console.log(`\n==================================================`);
      console.log(`✅ BERHASIL: Akun ADMIN baru telah berhasil dibuat!`);
      console.log(`--------------------------------------------------`);
      console.log(`Email    : ${email}`);
      console.log(`Password : ${password}`);
      console.log(`Role     : admin`);
      console.log(`==================================================\n`);
    }
  } catch (error) {
    console.error('❌ Terjadi kesalahan:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Koneksi database ditutup.');
  }
};

run();
