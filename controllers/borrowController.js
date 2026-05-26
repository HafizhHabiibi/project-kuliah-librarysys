const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// POST /borrow/:bookId — Pinjam buku
exports.borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      req.flash('error', 'Buku tidak ditemukan');
      return res.redirect('/books');
    }

    if (book.stok <= 0) {
      req.flash('error', 'Stok buku habis');
      return res.redirect(`/books/detail/${book._id}`);
    }

    // Check if user already borrowed this book
    const existingBorrow = await Borrow.findOne({
      user: req.user._id,
      book: book._id,
      status: 'dipinjam'
    });

    if (existingBorrow) {
      req.flash('error', 'Anda sudah meminjam buku ini');
      return res.redirect(`/books/detail/${book._id}`);
    }

    // Create borrow record
    await Borrow.create({
      user: req.user._id,
      book: book._id
    });

    // Decrease book stock
    book.stok -= 1;
    await book.save();

    req.flash('success', `Berhasil meminjam buku "${book.judul}"`);
    res.redirect('/borrow/mybooks');
  } catch (error) {
    console.error('Borrow error:', error);
    req.flash('error', 'Gagal meminjam buku');
    res.redirect('/books');
  }
};

// POST /borrow/return/:id — Kembalikan buku
exports.returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id).populate('book');

    if (!borrow) {
      req.flash('error', 'Data peminjaman tidak ditemukan');
      return res.redirect('/borrow/mybooks');
    }

    // Ensure user can only return their own borrows
    if (borrow.user.toString() !== req.user._id.toString()) {
      req.flash('error', 'Anda tidak memiliki akses');
      return res.redirect('/borrow/mybooks');
    }

    if (borrow.status === 'dikembalikan') {
      req.flash('error', 'Buku sudah dikembalikan sebelumnya');
      return res.redirect('/borrow/mybooks');
    }

    // Update borrow record
    borrow.status = 'dikembalikan';
    borrow.tanggalKembali = new Date();
    await borrow.save();

    // Increase book stock
    const book = await Book.findById(borrow.book._id);
    if (book) {
      book.stok += 1;
      await book.save();
    }

    req.flash('success', `Buku "${borrow.book.judul}" berhasil dikembalikan`);
    res.redirect('/borrow/mybooks');
  } catch (error) {
    console.error('Return error:', error);
    req.flash('error', 'Gagal mengembalikan buku');
    res.redirect('/borrow/mybooks');
  }
};

// GET /borrow/mybooks — Daftar buku yang dipinjam
exports.getMyBooks = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user._id })
      .populate('book')
      .sort({ createdAt: -1 });

    res.render('borrow/mybooks', {
      title: 'Buku Saya - Perpustakaan',
      layout: 'layouts/main',
      borrows
    });
  } catch (error) {
    console.error('My books error:', error);
    req.flash('error', 'Gagal memuat daftar peminjaman');
    res.redirect('/dashboard');
  }
};
