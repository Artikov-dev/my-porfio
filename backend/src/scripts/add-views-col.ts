import { db } from '../config/database';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const addViewsColumn = async () => {
  try {
    console.log('⏳ Adding views column to projects table...');
    
    // Add views column if it doesn't exist
    await db.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
    `);

    // Add views column if it doesn't exist to blogs just in case (we did it in init-db but let's be safe)
    await db.query(`
      ALTER TABLE blogs 
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
    `);
    
    // Also, update existing projects to have views = random number between 10 and 50 just for cool demo
    await db.query(`
      UPDATE projects 
      SET views = floor(random() * 40 + 10)::int
      WHERE views = 0 OR views IS NULL;
    `);

    // Add dummy chat messages if empty for the line chart demo
    const chats = await db.query('SELECT count(*) FROM chat_messages');
    if (parseInt(chats.rows[0].count) < 5) {
      console.log('Adding dummy chat messages...');
      const pastDates = [1, 2, 3, 5, 7, 10, 15, 20].map(daysAgo => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString();
      });
      
      for (const date of pastDates) {
        await db.query(`
          INSERT INTO chat_messages (session_id, name, text, is_admin, created_at)
          VALUES ($1, $2, $3, $4, $5)
        `, ['dummy-session', 'Guest ' + Math.floor(Math.random()*100), 'Hello!', false, date]);
      }
    }

    console.log('✅ Success! views column added and dummy stats seeded.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding views column:', error);
    process.exit(1);
  }
};

addViewsColumn();
