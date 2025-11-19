import { neon } from '@neondatabase/serverless';

// Database connection 
const sql = neon(process.env.DATABASE_URL);

export { sql };