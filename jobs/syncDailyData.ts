import { getDb, collections } from '../db/mongodb';
import { getDailyFitnessData } from "../libs/googleFit";
import { UserDataType } from '../data';
import _ from 'lodash';
import dataSource from '../config/dataSource';
import moment, { Moment } from "moment";
import { getLastFriday } from "../utils/dateTimeUtils";
import {Db} from "mongodb";

const duration = 86400000;

const syncDailyDataByDataSourceWithOnlyUser = async (
  dataSource: string,
  user: UserDataType,
  lastFridayValue: number,
  nextFridayValue: number,
  db: Db,
) => {
  const dailyFitnessData = await getDailyFitnessData(
    user.refresh_token,
    lastFridayValue,
    nextFridayValue,
    dataSource,
    86400000
  );
  if (dailyFitnessData) {
    const dailyStepDataCollection = await db.collection(collections.dailyStepData);
    const bucket = dailyFitnessData.bucket;
    for (let j = 0; j < bucket.length; j++) {
      const buck = bucket[j];
      const step = _.get(buck, 'dataset.0.point.0.value.0.intVal');
      if (step !== undefined) {
        const dataWillSave = {
          userId: user._id,
          email: user.email,
          startDate: buck.startTimeMillis,
          endDate: buck.endTimeMillis,
          duration: duration,
          step: _.get(buck, 'dataset.0.point.0.value.0.intVal', 0),
          dataSource: dataSource,
        };
        console.log(`Sync ${user.name} ${moment(parseInt(buck.startTimeMillis)).format()} ${step}`);
        await dailyStepDataCollection.findOneAndReplace(
          { userId: user._id, startDate: buck.startTimeMillis },
          dataWillSave,
          { upsert: true },
        );
      }
    }
  }
};

const syncDailyDataByDataSource = async (dataSource: string, today?: Moment) => {
  const db = await getDb();
  if (db) {
    const usersCollection = await db.collection(collections.users);
    const allUsers = (await usersCollection.find().toArray()) as UserDataType[];
    const lastFriday = getLastFriday(today);
    const nextFriday = lastFriday.clone().add(7, "day");
    const lastFridayValue = lastFriday.valueOf();
    const nextFridayValue = nextFriday.valueOf();

    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      await syncDailyDataByDataSourceWithOnlyUser(dataSource, user, lastFridayValue, nextFridayValue, db);
    }
  }
};

export const syncDailyDataForOnlyUser = async (user: UserDataType) => {
  for (let i = 0; i < dataSource.length; i++) {
    const lastFriday = getLastFriday();
    const nextFriday = lastFriday.clone().add(7, "day");
    const lastFridayValue = lastFriday.valueOf();
    const nextFridayValue = nextFriday.valueOf();
    await syncDailyDataByDataSourceWithOnlyUser(dataSource[i], user, lastFridayValue, nextFridayValue, await getDb());
  }
};

const syncDailyData = async (today?: Moment) => {
  for (let i = 0; i < dataSource.length; i++) {
    await syncDailyDataByDataSource(dataSource[i], today);
  }
};

export default syncDailyData;
