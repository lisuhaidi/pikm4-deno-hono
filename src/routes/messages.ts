import { Hono } from 'hono';
import { Message } from '../models/message.ts';

const messages = new Hono();

// Tambah pesan baru
messages.post('/', async (c) => {
  const { text, user } = await c.req.json();
  if (!text || !user) {
    return c.json({ error: 'Text and user are required' }, 400); // Bad Request jika input tidak valid
  }
  const message = new Message({ text, user });
  console.log(message);
  await message.save();
  return c.json(message, 201);
});

// ambil pesan dengan pagination per 10 dan di sorting ke yang terbaru
messages.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1'); // Halaman saat ini, default 1
  const limit = 10; // Jumlah data per halaman

  try {
    // Hitung total data
    const totalMessages = await Message.countDocuments();

    // Ambil data untuk halaman tertentu dengan sorting
    const messages = await Message.find()
      .sort({ createdAt: -1 }) // Urutkan berdasarkan waktu terbaru
      .skip((page - 1) * limit) // Lewati data berdasarkan halaman
      .limit(limit); // Ambil sejumlah data sesuai limit

    // Respons hasil
    return c.json({
      totalMessages, // Total semua pesan
      totalPages: Math.ceil(totalMessages / limit), // Total halaman
      currentPage: page, // Halaman saat ini
      messages, // Data pesan untuk halaman ini
    });
  } catch (error) {
    return c.json({ error: 'Something went wrong' }, 500);
  }
});


  // Ambil pesan berdasarkan ID
messages.get('/:id', async (c) => {
    const { id } = c.req.param();
    const message = await Message.findById(id);
    if (!message) return c.json({ error: 'Message not found' }, 404);
    return c.json(message);
  });
  
  // Perbarui pesan
  messages.put('/:id', async (c) => {
    const { id } = c.req.param();
    const { text } = await c.req.json();
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    if (!updatedMessage) return c.json({ error: 'Message not found' }, 404);
    return c.json(updatedMessage);
  });
  
  // Hapus pesan
  messages.delete('/:id', async (c) => {
    const { id } = c.req.param();
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) return c.json({ error: 'Message not found' }, 404);
    return c.json({ message: 'Message deleted' });
  });
  
  // Tambah suka pada pesan
  messages.patch('/:id/like', async (c) => {
    const { id } = c.req.param();
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true }
    );
    if (!updatedMessage) return c.json({ error: 'Message not found' }, 404);
    return c.json(updatedMessage);
  });
  

export default messages;