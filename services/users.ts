import {collections, getDb} from '../db/mongodb';
import {DailyFitnessData, UserDataType} from '../data';
import {getLastFriday} from "../utils/dateTimeUtils";
import _ from 'lodash';

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

export const getLeaderBoard = async () => {
  const db = await getDb();
  if (db) {
    const dailyStepDataCollection = db.collection(collections.dailyStepData);
    const usersCollection = db.collection(collections.users);
    const lastFriday = getLastFriday();
    const allDailyStep = await dailyStepDataCollection.find({
      startDate: { $gte: `${lastFriday.valueOf()}` },
    }).toArray();
    const stepsByUser = _.groupBy(allDailyStep, 'email');
    const stepByUser = {};
    _.forEach(stepsByUser, (val: DailyFitnessData[], key: string) => {
      stepByUser[key] = _.reduce(val, (sum: number, fitnessData: DailyFitnessData) => sum += fitnessData.step, 0);
    });
    const allUserEmails = Object.keys(stepByUser);
    const allUser = await usersCollection.find({ email: { $in: allUserEmails }}).toArray();

    return _.orderBy(_.map(allUser, (user: UserDataType) => (
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
        totalStep: stepByUser[user.email],
      }
    )), ['totalStep'], ['desc']);
  }
  return [];
};
