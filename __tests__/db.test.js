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
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw new Error('Database connection failed');
    }
  });

  it('should retrieve data from the User table', async () => {
    const users = await db.User.findAll();
    expect(users).toBeInstanceOf(Array);
  });
});
