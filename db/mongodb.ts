import { Db, MongoClient } from 'mongodb';
import dbConfig from '../config/dbconfig';

const uri = dbConfig.connectionString;

const client = new MongoClient(uri, {  useUnifiedTopology: true });

export const mongoDb: { db?: Db } = {};

export const collections = {
  users: 'users',
};


export const initDb = async () => {
  try {
    await client.connect();

    mongoDb.db = client.db();
    console.log('Connect mongodb successfully!');

  } catch (e) {
    console.log('Error connect mongodb', e);
    await client.close();
  }
};
