import {collections, getDb } from '../db/mongodb';
import { UserDataType } from '../data';
import {getLastFriday} from "../utils/dateTimeUtils";

export const writeUser = async (user: UserDataType) => {
    const db = await getDb();
    if (db) {
        console.log('write', user);
        const usersCollection = db.collection(collections.users);
        await usersCollection.findOneAndReplace({ email: user.email }, user, { upsert: true });
        return user;
    }
    return undefined;
};

export const getListUsers = async () => {
    const db = await getDb();
    if (db) {
        const usersCollection = db.collection(collections.users);
        return await usersCollection.find({}).toArray();
    }
    return [];
};

export const getUserByEmail = async (email: string) => {
  const db = await getDb();
  if (db) {
    const usersCollection = db.collection(collections.users);
    return await usersCollection.findOne({ email });
  }
};

export const getDailyStepOfCurrentWeekByEmail = async (email: string) => {
  const db = await getDb();
  if (db) {
    const dailyStepDataCollection = db.collection(collections.dailyStepData);
    const lastFriday = getLastFriday();
    return dailyStepDataCollection.find({ email, startDate: { $gte: `${lastFriday.valueOf()}` } }).toArray();
  }
};
