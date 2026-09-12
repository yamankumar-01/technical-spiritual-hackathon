import mongoose from 'mongoose';
import { Team } from '../backend/src/models/Team.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function checkIndexes() {
  // Connect to the same database port
  // First fetch /api/health to ensure server is alive
  const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
  console.log('Server health:', health);

  // Read backend task log to get mongo uri
  const fs = await import('fs');
  const path = await import('path');
  const logs = fs.readFileSync('C:\\Users\\yaman\\.gemini\\antigravity-ide\\brain\\9bc0ad6b-7b10-4365-ad46-a9964c4516a9\\.system_generated\\tasks\\task-3184.log', 'utf8');
  const match = logs.match(/mongodb:\/\/127\.0\.0\.1:\d+\//);
  if (!match) {
    console.log('Could not find mongo URI in logs');
    return;
  }
  const uri = match[0];
  console.log('Connecting to live mongo at:', uri);
  await mongoose.connect(uri);

  const indexes = await Team.collection.getIndexes();
  console.log('Live MongoDB Indexes on teams collection:\n', JSON.stringify(indexes, null, 2));

  // Check teams in database
  const teams = await Team.find({}, 'teamName teamCode participantEmails');
  console.log(`Found ${teams.length} teams in database:`);
  teams.forEach(t => console.log(` - ${t.teamCode}: participantEmails =`, t.participantEmails));

  await mongoose.disconnect();
}

checkIndexes().catch(console.error);
