require('dotenv').config({ silent: true });

module.exports = {
  development: {
    url: process.env.DB_URL,
    logging: false,
    ssl: true,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      // ca: process.env.CA_CERT },
    },
    define: {
      timestamps: true,
    },
  },
  test: {
    url: 'postgresql://localhost:5432',
    database: 'postgres',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DB_URL,
    ssl: true,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }, 
        //ca: process.env.CA_CERT },
    },
    define: {
      timestamps: true,
    },
  },
};
