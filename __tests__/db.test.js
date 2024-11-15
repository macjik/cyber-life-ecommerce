import db, { sequelize } from '@/models/index';

describe('Database Connection Test', () => {
  beforeAll(async () => {
    // Connect to the database
    await sequelize.authenticate();
  });

  afterAll(async () => {
    // Close the database connection after tests
    await sequelize.close();
  });

  it('should successfully connect to the database', async () => {
    try {
      // Attempt to authenticate the connection
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw new Error('Database connection failed');
    }
  });

  it('should retrieve data from the User table', async () => {
    const users = await db.User.findAll(); // Adjust according to your DB model
    expect(users).toBeInstanceOf(Array); // Ensure an array is returned
  });
});
