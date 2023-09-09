import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createConnection({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_TABLE,
});

export async function connect() {
  try {
    await pool;
    console.log('Connection successfully estabilished!');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default pool;
