import { Hono } from 'hono';
import { User } from '../models/user.ts';
import bcrypt from 'bcryptjs';

const users = new Hono();

// Registrasi user baru
users.post('/register', async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Periksa apakah username sudah digunakan
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return c.json({ error: 'Username sudah ada' }, 400);
    }

    // Hash password sebelum menyimpan ke database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("username: " + username +" password: " + hashedPassword)
    // Simpan user baru
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();


    return c.json({ 
      message: 'User registered successfully', 
      username: username, 
      userId: newUser._id 
    }, 201);
    
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

// Login user
users.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
 
    // Cari user berdasarkan username
    const user = await User.findOne({ username });
    if (!user) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    // Return sukses
    return c.json({ message: 'Login successful', user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to login user' }, 500);
  }
});

// Ambil profil user berdasarkan ID
users.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const user = await User.findById(id).select('-password'); // Jangan tampilkan password
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Update Bio
users.put('/update-bio/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { bio } = await c.req.json();

    console.log(bio);

    // Validasi panjang bio
    if (bio && bio.length > 100) {
      return c.json({ error: 'Bio tidak boleh lebih dari 100 karakter' }, 400);
    }

    // Cari user berdasarkan ID
    const user = await User.findById(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update bio
    user.bio = bio;
    await user.save();

    return c.json({ message: 'Bio updated successfully', bio: user.bio }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update bio' }, 500);
  }
});


export default users;
