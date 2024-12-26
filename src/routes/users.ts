import { Hono } from 'hono';
import { User } from '../models/user.ts';
import { validateInput, findUserById, hashPassword, comparePassword } from '../utils/userUtils.ts';

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
    const hashedPassword = await hashPassword(password);

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
    const isPasswordValid = await comparePassword(password, user.password);
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
    const user = await findUserById(id, true); // Jangan tampilkan password
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

    // Validasi panjang bio
    if (bio && bio.length > 100) {
      return c.json({ error: 'Bio tidak boleh lebih dari 100 karakter' }, 400);
    }

    // Cari user berdasarkan ID
    const user = await findUserById(id);
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

// Ubah kata sandi
users.put('/change-password/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { oldPassword, newPassword } = await c.req.json();

    // Validasi input
    validateInput({ oldPassword, newPassword });

    // Cari user berdasarkan ID
    const user = await findUserById(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Verifikasi kata sandi lama
    const isOldPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return c.json({ error: 'Old password is incorrect' }, 401);
    }

    // Hash kata sandi baru
    const hashedNewPassword = await hashPassword(newPassword);

    // Simpan kata sandi baru ke database
    user.password = hashedNewPassword;
    await user.save();

    return c.json({ message: 'Password updated successfully' }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update password' }, 500);
  }
});

// Hapus akun
users.delete('/delete-account/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { password } = await c.req.json(); // User harus mengirimkan password untuk verifikasi

    // Cari user berdasarkan ID
    const user = await findUserById(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: 'Invalid password' }, 401);
    }

    // Hapus user dari database
    await user.delete();

    return c.json({ message: 'Account deleted successfully' }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete account' }, 500);
  }
});


export default users;
