// change-admin.js — run this to update the admin username and/or password
// Usage: node change-admin.js
// The new credentials are read from your .env file (ADMIN_USERNAME / ADMIN_PASSWORD).

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const newUsername = process.env.ADMIN_USERNAME;
  const newPassword = process.env.ADMIN_PASSWORD;

  if (!newUsername || !newPassword) {
    console.error('ERROR: Set ADMIN_USERNAME and ADMIN_PASSWORD in your .env file first.');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(newPassword, 12);

  const result = await prisma.admin.updateMany({
    data: { username: newUsername, password: hashed }
  });

  if (result.count === 0) {
    console.log('No admin found in the database. Run "npm run seed" to create one first.');
  } else {
    console.log(`✓ Admin credentials updated successfully.`);
    console.log(`  Username: ${newUsername}`);
    console.log(`  Password: (hashed and saved)`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
