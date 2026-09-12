import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function testMongoUniqueMultikey() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const schema = new mongoose.Schema({
    teamName: String,
    emails: { type: [String], index: { unique: true } },
  });

  const TestTeam = mongoose.model('TestTeam', schema);
  await TestTeam.init(); // ensure indexes are built

  const clashEmail = 'clash@test.com';

  const [res1, res2] = await Promise.allSettled([
    TestTeam.create({ teamName: 'Team 1', emails: ['lead1@test.com', clashEmail] }),
    TestTeam.create({ teamName: 'Team 2', emails: ['lead2@test.com', clashEmail] }),
  ]);

  console.log('Result 1:', res1.status, res1.value?.teamName || res1.reason?.message);
  console.log('Result 2:', res2.status, res2.value?.teamName || res2.reason?.message);

  const oneSucceededOneFailed = 
    (res1.status === 'fulfilled' && res2.status === 'rejected') ||
    (res2.status === 'fulfilled' && res1.status === 'rejected');

  console.log('Did unique multikey index prevent the race condition?', oneSucceededOneFailed);

  await mongoose.disconnect();
  await mongod.stop();
}

testMongoUniqueMultikey().catch(console.error);
