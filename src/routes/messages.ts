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

// Ambil semua pesan
messages.get('/', async (c) => {
    const allMessages = await Message.find();
    if (allMessages.length === 0) {
      return c.json({ message: 'No messages found' });
    }
    return c.json(allMessages);
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