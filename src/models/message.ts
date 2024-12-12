import mongoose from 'mongoose';

// Definisikan schema dengan field likes
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Pesan wajib diisi
  createdAt: { type: Date, default: Date.now }, // Waktu dibuat otomatis
  likes: { type: Number, default: 0 }, // Jumlah suka default 0
  user: { type: String, default: "admin"}
});

// Buat model berdasarkan schema
export const Message = mongoose.model('Message', messageSchema);
