import bcrypt from 'bcrypt';
import { pool } from '../config/db';
const saltRounds = 10;

export async function registerUser(email: string, password: string, name: string) {
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id,email,created_at',
        [email, passwordHash, name]
    );
    return result.rows[0];
}