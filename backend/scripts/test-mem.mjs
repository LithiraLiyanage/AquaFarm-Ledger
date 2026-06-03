import { MongoMemoryServer } from 'mongodb-memory-server';

(async () => {
  try {
    console.log('Creating in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    console.log('Created. URI:', mongod.getUri());
    await mongod.stop();
    console.log('Stopped.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating MongoMemoryServer:', err);
    process.exit(1);
  }
})();
