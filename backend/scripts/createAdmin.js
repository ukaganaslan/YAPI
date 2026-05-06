require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthai');

  const existing = await User.findOne({ email: 'admin@mit.edu' });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  await User.create({
    name: 'Platform Admin',
    email: 'admin@mit.edu',
    password: 'HealthAI@2026',
    role: 'Admin',
    institution: 'HealthAI Platform',
    isVerified: true,
  });

  console.log('✅ Admin user created.');
  console.log('   Email:    admin@mit.edu');
  console.log('   Password: HealthAI@2026');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
