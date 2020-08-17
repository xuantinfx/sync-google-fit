import {collections, initDb, mongoDb} from '../db/mongodb';

initDb().then().catch();

interface UserDataType {
    email: string;
    refresh_token: string;
    id_token: string;
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    locale: string,
}

export const writeUser = async (user: UserDataType) => {
    const db = mongoDb.db;
    if (db) {
        const usersCollection = db.collection(collections.users);
        await usersCollection.findOneAndReplace({ email: user.email }, user, { upsert: true });
        return user;
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
