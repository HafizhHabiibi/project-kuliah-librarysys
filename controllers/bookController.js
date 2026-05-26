const Book = require('../models/Book');
const Borrow = require('../models/Borrow');

// GET /books — Daftar semua buku
exports.getAllBooks = async (req, res) => {
  try {
    const { search, kategori } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { judul: { $regex: search, $options: 'i' } },
        { penulis: { $regex: search, $options: 'i' } }
      ];
    }

    if (kategori) {
      query.kategori = kategori;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    const categories = await Book.distinct('kategori');

    res.render('books/index', {
      title: 'Daftar Buku - Perpustakaan',
      layout: 'layouts/main',
      books,
      categories,
      search: search || '',
      selectedKategori: kategori || ''
    });
  } catch (error) {
    console.error('Get books error:', error);
    req.flash('error', 'Gagal memuat daftar buku');
    res.redirect('/dashboard');
  }
};

// GET /books/add — Form tambah buku (Admin)
exports.getAddBook = (req, res) => {
  res.render('books/add', {
    title: 'Tambah Buku - Perpustakaan',
    layout: 'layouts/main'
  });
};

// POST /books/add — Simpan buku baru (Admin)
exports.postAddBook = async (req, res) => {
  try {
    const { judul, penulis, kategori, tahunTerbit, stok } = req.body;

    if (!judul || !penulis || !kategori || !tahunTerbit || !stok) {
      req.flash('error', 'Semua field wajib diisi');
      return res.redirect('/books/add');
    }

    await Book.create({
      judul,
      penulis,
      kategori,
      tahunTerbit: parseInt(tahunTerbit),
      stok: parseInt(stok)
    });

    req.flash('success', 'Buku berhasil ditambahkan');
    res.redirect('/books');
  } catch (error) {
    console.error('Add book error:', error);
    req.flash('error', 'Gagal menambahkan buku');
    res.redirect('/books/add');
  }
};

// GET /books/detail/:id — Detail buku
exports.getBookDetail = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      req.flash('error', 'Buku tidak ditemukan');
      return res.redirect('/books');
    }

    // Check if user already borrowed this book
    let alreadyBorrowed = false;
    if (req.user.role === 'user') {
      const existingBorrow = await Borrow.findOne({
        user: req.user._id,
        book: book._id,
        status: 'dipinjam'
      });
      alreadyBorrowed = !!existingBorrow;
    }

    res.render('books/detail', {
      title: `${book.judul} - Perpustakaan`,
      layout: 'layouts/main',
      book,
      alreadyBorrowed
    });
  } catch (error) {
    console.error('Book detail error:', error);
    req.flash('error', 'Gagal memuat detail buku');
    res.redirect('/books');
  }
};

// GET /books/edit/:id — Form edit buku (Admin)
exports.getEditBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      req.flash('error', 'Buku tidak ditemukan');
      return res.redirect('/books');
    }

    res.render('books/edit', {
      title: `Edit: ${book.judul} - Perpustakaan`,
      layout: 'layouts/main',
      book
    });
  } catch (error) {
    console.error('Edit book error:', error);
    req.flash('error', 'Gagal memuat form edit');
    res.redirect('/books');
  }
};

// POST /books/edit/:id — Update buku (Admin)
exports.postEditBook = async (req, res) => {
  try {
    const { judul, penulis, kategori, tahunTerbit, stok } = req.body;

    await Book.findByIdAndUpdate(req.params.id, {
      judul,
      penulis,
      kategori,
      tahunTerbit: parseInt(tahunTerbit),
      stok: parseInt(stok)
    });

    req.flash('success', 'Buku berhasil diperbarui');
    res.redirect(`/books/detail/${req.params.id}`);
  } catch (error) {
    console.error('Update book error:', error);
    req.flash('error', 'Gagal memperbarui buku');
    res.redirect(`/books/edit/${req.params.id}`);
  }
};

// POST /books/delete/:id — Hapus buku (Admin)
exports.deleteBook = async (req, res) => {
  try {
    // Check if book has active borrows
    const activeBorrows = await Borrow.countDocuments({
      book: req.params.id,
      status: 'dipinjam'
    });

    if (activeBorrows > 0) {
      req.flash('error', 'Buku tidak bisa dihapus karena sedang dipinjam');
      return res.redirect('/books');
    }

    await Book.findByIdAndDelete(req.params.id);
    // Also delete all borrow records for this book
    await Borrow.deleteMany({ book: req.params.id });

    req.flash('success', 'Buku berhasil dihapus');
    res.redirect('/books');
  } catch (error) {
    console.error('Delete book error:', error);
    req.flash('error', 'Gagal menghapus buku');
    res.redirect('/books');
  }
};
