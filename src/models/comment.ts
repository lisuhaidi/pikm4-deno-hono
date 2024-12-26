import mongoose, { Schema, Document, model } from 'mongoose';

// Definisi interface untuk komentar
export interface IComment extends Document {
  messageId: mongoose.Types.ObjectId; // ID postingan terkait
  userId: mongoose.Types.ObjectId; // ID pengguna yang membuat komentar
  text: string; // Isi komentar
  createdAt: Date; // Waktu pembuatan komentar
  updatedAt: Date; // Waktu terakhir komentar diupdate (opsional)
}

// Skema untuk komentar
const CommentSchema: Schema = new Schema<IComment>(
  {
    messageId: { type: mongoose.Types.ObjectId, ref: 'Message', required: true }, // Referensi ke koleksi Message
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Referensi ke koleksi User
    text: { type: String, required: true, trim: true }, // Isi komentar
  },
  {
    timestamps: true, // Menambahkan createdAt dan updatedAt otomatis
  }
);

// Membuat model dari skema
const Comment = model<IComment>('Comment', CommentSchema);

export default Comment;
