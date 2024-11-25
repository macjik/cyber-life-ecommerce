import db, { sequelize } from '@/models/index';

describe('Database Connection Test', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should successfully connect to the database', async () => {
    try {
      await sequelize.authenticate();
    } catch (error) {
      throw new Error('Database connection failed', error);
    }
  });

  it('should successfully query the User table', async () => {
    try {
      await db.User.findAll();
    } catch (error) {
      throw new Error('Failed to query the User table: ' + error.message);
    }
  });
});
