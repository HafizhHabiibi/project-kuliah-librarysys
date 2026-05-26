const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');

const { passUser } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// --- View Engine ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Custom Cookie-Based Flash Middleware
app.use((req, res, next) => {
  let flashData = {};
  if (req.cookies && req.cookies.flash) {
    try {
      flashData = JSON.parse(req.cookies.flash);
    } catch (e) {
      flashData = {};
    }
  }

  req.flash = function(type, message) {
    if (type && message) {
      if (!flashData[type]) {
        flashData[type] = [];
      }
      flashData[type].push(message);
      res.cookie('flash', JSON.stringify(flashData), { httpOnly: true, maxAge: 10000 });
      return;
    } else if (type) {
      const messages = flashData[type] || [];
      delete flashData[type];
      if (Object.keys(flashData).length === 0) {
        res.clearCookie('flash');
      } else {
        res.cookie('flash', JSON.stringify(flashData), { httpOnly: true, maxAge: 10000 });
      }
      return messages;
    }
    return [];
  };

  next();
});

// Pass flash messages and user to all views
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

// Pass user info to views (non-blocking)
app.use(passUser);

// --- Routes ---
app.get('/', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

// Dashboard route
const { protect } = require('./middleware/auth');
const Book = require('./models/Book');
const User = require('./models/User');
const Borrow = require('./models/Borrow');

app.get('/dashboard', protect, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();

    if (req.user.role === 'admin') {
      const totalUsers = await User.countDocuments({ role: 'user' });
      const activeBorrows = await Borrow.countDocuments({ status: 'dipinjam' });
      const totalCategories = (await Book.distinct('kategori')).length;

      res.render('dashboard', {
        title: 'Dashboard - Perpustakaan',
        layout: 'layouts/main',
        totalBooks,
        totalUsers,
        activeBorrows,
        totalCategories
      });
    } else {
      const myBorrows = await Borrow.countDocuments({ user: req.user._id, status: 'dipinjam' });
      const myReturned = await Borrow.countDocuments({ user: req.user._id, status: 'dikembalikan' });

      res.render('dashboard', {
        title: 'Dashboard - Perpustakaan',
        layout: 'layouts/main',
        totalBooks,
        myBorrows,
        myReturned
      });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Gagal memuat dashboard');
    res.redirect('/auth/login');
  }
});

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/borrow', borrowRoutes);
app.use('/profile', profileRoutes);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).render('layouts/main', {
    title: '404 - Halaman Tidak Ditemukan',
    body: '<div class="empty-state"><span class="material-icons empty-icon">search_off</span><h3>404 - Halaman Tidak Ditemukan</h3><p>Halaman yang Anda cari tidak ada. <a href="/dashboard">Kembali ke Dashboard</a></p></div>'
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('layouts/main', {
    title: 'Error',
    body: '<div class="empty-state"><span class="material-icons empty-icon">error_outline</span><h3>Terjadi Kesalahan</h3><p>Mohon coba lagi nanti. <a href="/dashboard">Kembali ke Dashboard</a></p></div>'
  });
});

module.exports = app;
