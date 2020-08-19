import { Db, MongoClient } from 'mongodb';
import dbConfig from '../config/dbconfig';

const uri = dbConfig.connectionString;

const client = new MongoClient(uri, {  useUnifiedTopology: true });

const mongoDb: { db?: Db } = {};

export const collections = {
  users: 'users',
  dailyStepData: 'dailyStepData',
};

export const getDb = async () => {
  if (mongoDb.db) {
    return mongoDb.db;
  } else {
    await client.connect();
    console.log('Re Connect mongodb successfully!');
    mongoDb.db = await client.db();
    return mongoDb.db;
  }
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
