import {collections, initDb, mongoDb} from '../db/mongodb';
import { UserDataType } from '../data';

initDb().then().catch();

export const writeUser = async (user: UserDataType, i?: number) => {
    const db = mongoDb.db;
    if (db) {
        console.log('write', user);
        const usersCollection = db.collection(collections.users);
        await usersCollection.findOneAndReplace({ email: user.email }, user, { upsert: true });
        return user;
    } else {
      if (i === undefined || i < 5) {
        console.log('Retry write', user);
        setTimeout(() => {
          writeUser(user, i !== undefined ? i + 1 : 0);
        }, 1000);
      } else {
        console.log('Reject write because cannot connect to db', user);
      }
    }
    return undefined;
};

export const getListUsers = async () => {
    const db = mongoDb.db;
    if (db) {
        const usersCollection = db.collection(collections.users);
        return await usersCollection.find({}).toArray();
    }
    return [];
};

export const getUserByEmail = async (email: string) => {
  const db = mongoDb.db;
  if (db) {
    const usersCollection = db.collection(collections.users);
    return await usersCollection.findOne({ email });
  }
};
