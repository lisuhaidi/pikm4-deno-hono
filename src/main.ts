import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors'
import { connect } from 'mongoose';
import messages from './routes/messages.ts';
import users from './routes/users.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";


const env = config();
const MONGODB_URI = env.MONGODB_URI || '';
const PORT = Number(env.PORT) || 8000;

const app = new Hono()

// Use logger middleware
app.use("*", logger());

// middleware pretty json
app.use(prettyJSON());

// CORS middleware
app.use(
  '/*',
  cors({
    origin: "*", // Ganti dengan URL spesifik jika hanya mengizinkan domain tertentu
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

// hubungkan ke MongoDB
connect(MONGODB_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (c) => c.text('Hello Deno!'));
app.get('/hello', (c) => c.text('Hello world'));

// tambhahkan rute pesan
app.route('/messages', messages);
// tambahkan rute user
app.route('/user', users)

Deno.serve({ port: PORT }, app.fetch);
