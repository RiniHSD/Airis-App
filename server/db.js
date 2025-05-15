import pkg from 'pg'
import { DATABASE_URL } from './config.js'

const { Pool } = pkg
export const pool = new Pool({ connectionString: DATABASE_URL })

// Test koneksi saat server dijalankan
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Gagal konek ke PostgreSQL:', err.message)
  } else {
    console.log('✅ Koneksi PostgreSQL berhasil:', res.rows[0].now)
  }
})