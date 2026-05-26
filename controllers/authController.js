const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// GET /auth/login
exports.getLogin = (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', {
    title: 'Login - Perpustakaan',
    layout: 'layouts/main'
  });
};

// POST /auth/login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Email dan password wajib diisi');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      req.flash('error', 'Email atau password salah');
      return res.redirect('/auth/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Email atau password salah');
      return res.redirect('/auth/login');
    }

    const token = generateToken(user._id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    req.flash('success', `Selamat datang, ${user.nama}!`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Terjadi kesalahan saat login');
    res.redirect('/auth/login');
  }
};

// GET /auth/register
exports.getRegister = (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.render('auth/register', {
    title: 'Register - Perpustakaan',
    layout: 'layouts/main'
  });
};

// POST /auth/register
exports.postRegister = async (req, res) => {
  try {
    const { nama, email, password, password2 } = req.body;

    if (!nama || !email || !password || !password2) {
      req.flash('error', 'Semua field wajib diisi');
      return res.redirect('/auth/register');
    }

    if (password !== password2) {
      req.flash('error', 'Password tidak cocok');
      return res.redirect('/auth/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password minimal 6 karakter');
      return res.redirect('/auth/register');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'Email sudah terdaftar');
      return res.redirect('/auth/register');
    }

    await User.create({ nama, email, password });

    req.flash('success', 'Registrasi berhasil! Silakan login');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Register error:', error);
    req.flash('error', 'Terjadi kesalahan saat registrasi');
    res.redirect('/auth/register');
  }
};

// GET /auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'Berhasil logout');
  res.redirect('/auth/login');
};
