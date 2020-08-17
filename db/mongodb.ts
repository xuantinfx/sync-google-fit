import { Db, MongoClient } from 'mongodb';
import dbConfig from '../config/dbconfig';

const uri = `mongodb://${dbConfig.host}:${dbConfig.host}`;

const client = new MongoClient(uri, {  useUnifiedTopology: true });

export const mongoDb: { db?: Db } = {};

export const collections = {
  users: 'users',
};

// Database Name

const dbName = dbConfig.dbName;

export const initDb = async () => {
  try {
    await client.connect();

    mongoDb.db = client.db(dbName);
    console.log('Connect mongodb successfully!');

  } catch (e) {
    console.log('Error connect mongodb', e);
    await client.close();
  }
};
