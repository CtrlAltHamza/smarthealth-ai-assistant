import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dialect = process.env.DB_DIALECT === 'sqlite' ? 'sqlite' : 'postgres';

const sequelize = dialect === 'sqlite'
  ? new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './smarthealth.sqlite',
    logging: false,
  })
  : new Sequelize(
    process.env.DB_NAME || 'smarthealth',
    process.env.DB_USER || 'admin',
    process.env.DB_PASSWORD || 'adminpassword',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres',
      logging: false,
    }
  );

export default sequelize;
