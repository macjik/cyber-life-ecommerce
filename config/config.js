require('dotenv').config({ silent: true });
const pg = require('pg');

module.exports = {
  development: {
    url: process.env.DB_URL,
    logging: false,
    ssl: true,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      // ca: process.env.CA_CERT },
    },
    define: {
      timestamps: true,
    },
  },
  test: {
    url: process.env.DB_URL,
    // logging: false,
    // ssl: true,
    dialect: 'postgres',
    dialectModule: pg,
    // dialectOptions: {
    //   ssl: { require: true, rejectUnauthorized: false },
    // },
    // define: {
    //   timestamps: true,
  },
  //},
  production: {
    url: process.env.DB_URL,
    ssl: true,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      //ca: process.env.CA_CERT },
    },
    define: {
      timestamps: true,
    },
  },
};
