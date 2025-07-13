const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')
require('dotenv').config()

async function migrateAddPasswords() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    console.log('🔄 Running password migration...')
    
    const sql = neon(process.env.DATABASE_URL)
    
    // Add password column to users table if it doesn't exist
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password TEXT;
    `
    console.log('✅ Added password column to users table')
    
    // Update existing admin user with hashed password
    const adminPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email = 'admin@belalbarber.com' AND password IS NULL;
    `
    console.log('✅ Updated admin user with hashed password')
    
    // Make password column NOT NULL after updating existing records
    await sql`
      ALTER TABLE users 
      ALTER COLUMN password SET NOT NULL;
    `
    console.log('✅ Made password column required')
    
    console.log('🎉 Password migration completed successfully!')
    console.log('👤 Admin credentials: admin@belalbarber.com / admin123')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateAddPasswords() 