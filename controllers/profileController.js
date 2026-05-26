const User = require('../models/User');

// GET /profile — Halaman profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.render('profile/index', {
      title: 'Profil Saya - Perpustakaan',
      layout: 'layouts/main',
      profile: user
    });
  } catch (error) {
    console.error('Profile error:', error);
    req.flash('error', 'Gagal memuat profil');
    res.redirect('/dashboard');
  }
};

// POST /profile/edit — Update profil
exports.postEditProfile = async (req, res) => {
  try {
    const { nama, email, alamat, noTelp } = req.body;

    if (!nama || !email) {
      req.flash('error', 'Nama dan email wajib diisi');
      return res.redirect('/profile');
    }

    // Check if email is taken by another user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      req.flash('error', 'Email sudah digunakan oleh user lain');
      return res.redirect('/profile');
    }

    await User.findByIdAndUpdate(req.user._id, {
      nama,
      email: email.toLowerCase(),
      alamat: alamat || '',
      noTelp: noTelp || ''
    });

    req.flash('success', 'Profil berhasil diperbarui');
    res.redirect('/profile');
  } catch (error) {
    console.error('Edit profile error:', error);
    req.flash('error', 'Gagal memperbarui profil');
    res.redirect('/profile');
  }
};
