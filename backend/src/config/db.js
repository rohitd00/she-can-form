// db.js — exports a single shared Prisma client instance.
// Reusing one instance avoids exhausting DB connection limits.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
});

module.exports = prisma;
