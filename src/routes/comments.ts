import { Hono } from 'hono';
import Comment from '../models/comment.ts';
import mongoose from 'mongoose';

const comments = new Hono();

// Ambil semua komentar untuk pesan tertentu
comments.get('/:id/comments', async (c) => {
  const messageId = c.req.param('id');
  const page = parseInt(c.req.query('page') || '1');
  const limit = 10;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return c.json({ error: 'Invalid message ID' }, 400);
  }

  try {
    const totalComments = await Comment.countDocuments({ messageId: messageId });
    const comments = await Comment.find({ messageId: messageId })
      .sort({ createdAt: -1 }) // Urutkan berdasarkan waktu terbaru
      .skip((page - 1) * limit) // Lewati data sebelumnya
      .limit(limit); // Batas data per halaman

    return c.json({
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page,
      comments,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

// Tambah komentar ke pesan tertentu
comments.post('/:id/comments', async (c) => {
  const messageId = c.req.param('id');
  const { userId, text } = await c.req.json();

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return c.json({ error: 'Invalid message ID' }, 400);
  }

  if (!userId || !text) {
    return c.json({ error: 'userId and text are required' }, 400);
  }

  try {
    const newComment = new Comment({
      messageId, // ID pesan terkait
      userId, // ID pengguna
      text, // Isi komentar
      createdAt: new Date(),
    });

    await newComment.save();

    return c.json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to add comment' }, 500);
  }
});

// Hapus komentar berdasarkan ID
comments.delete('/:id/comments/:commentId', async (c) => {
  const messageId = c.req.param('id');
  const commentId = c.req.param('commentId');

  if (!mongoose.Types.ObjectId.isValid(messageId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return c.json({ error: 'Invalid message ID or comment ID' }, 400);
  }

  try {
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      messageId: messageId,
    });

    if (!deletedComment) {
      return c.json({ error: 'Comment not found or does not belong to this message' }, 404);
    }

    return c.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to delete comment' }, 500);
  }
});

export default comments;
