import { pool } from '../../db.js'
import bcrypt from 'bcryptjs'

// Register user
export async function registerUser(req, res) {
  const { name, email, telp, password } = req.body

  // Cek input
  if (!name || !email || !telp || !password) {
    return res.status(400).json({ error: 'Semua field wajib diisi' })
  }

  try {
    // Hash password sebelum disimpan
    const hash = await bcrypt.hash(password, 10)

    // Simpan ke database — ID tidak perlu disebut
    const result = await pool.query(
      `INSERT INTO users (name, email, telp, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, telp`,
      [name, email, telp, hash]
    )

    // Kirim data pengguna yang baru
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Register Error:', err.message)
    res.status(500).json({ error: 'Gagal mendaftar. ' + err.message })
  }
}

// Login user
export async function loginUser(req, res) {
  const { email, password } = req.body

  // Cek input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' })
  }

  try {
    // Cari user berdasarkan email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    console.log('Password input:', password);
    console.log('Password from DB:', user.password);

    // Cocokkan password dengan hash di database
    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Kirim data user (tanpa password)
    res.json({ id: user.id, name: user.name, email: user.email })
  } catch (err) {
    console.error('Login Error:', err.message)
    res.status(500).json({ error: 'Gagal login. ' + err.message })
  }
}
