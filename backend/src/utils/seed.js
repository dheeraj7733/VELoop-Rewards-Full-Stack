require('dotenv').config();
const connectDB = require('../config/db');
const seedDatabase = require('./seedFunction');

const run = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};
run();
