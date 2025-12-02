const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(email, username, business_name, passwordHash) {
    const result = await pool.query(
      'INSERT INTO users (email, username, business_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, username, business_name, created_at',
      [email, username, business_name, passwordHash]
    );
    return result.rows[0];
  }
}

module.exports = User;
