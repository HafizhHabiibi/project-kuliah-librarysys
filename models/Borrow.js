const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  tanggalPinjam: {
    type: Date,
    default: Date.now
  },
  tanggalKembali: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['dipinjam', 'dikembalikan'],
    default: 'dipinjam'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Borrow', borrowSchema);
