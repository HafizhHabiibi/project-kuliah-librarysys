const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: [true, 'Judul buku wajib diisi'],
    trim: true
  },
  penulis: {
    type: String,
    required: [true, 'Penulis wajib diisi'],
    trim: true
  },
  kategori: {
    type: String,
    required: [true, 'Kategori wajib diisi'],
    trim: true
  },
  tahunTerbit: {
    type: Number,
    required: [true, 'Tahun terbit wajib diisi']
  },
  stok: {
    type: Number,
    required: [true, 'Stok wajib diisi'],
    min: [0, 'Stok tidak boleh kurang dari 0'],
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
