import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const checkDb = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects';",
    );
    console.log(res.rows);
    client.release();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDb();
