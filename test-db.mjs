import pg from 'pg';
const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Pilhadeira10%40@db.onpbpjpicxahnwrdzrbx.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});
pool.query('SELECT NOW()').then(res => {
  console.log('Success:', res.rows);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
