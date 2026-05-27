// seed.js — creates a default admin account on first run
// IMPORTANT: Set ADMIN_USERNAME and ADMIN_PASSWORD in your .env before running this script.
// Never commit real credentials to source control.

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('ERROR: ADMIN_PASSWORD is not set in your .env file.');
    console.error('Add ADMIN_PASSWORD="your_strong_password" to .env and re-run.');
    process.exit(1);
  }

  const existing = await prisma.admin.findUnique({
    where: { username }
  });

  if (existing) {
    console.log(`Admin "${username}" already exists — skipping seed.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.admin.create({
    data: { username, password: hashed }
  });

  console.log(`Admin "${username}" created successfully.`);
  console.log('Keep your credentials safe and do not share them.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
