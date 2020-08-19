import { mongoDb, collections } from '../db/mongodb';
import momentTZ from 'moment-timezone';
import { getDailyFitnessData } from "../libs/googleFit";
import { UserDataType } from '../data';
import _ from 'lodash';
import dataSource from '../config/dataSource';
import moment, { Moment } from "moment";

const timeZone = 'Asia/Ho_Chi_Minh';
const duration = 86400000;

const getLastFriday = (today?: Moment) => {
  const startOfToday = today ? today.clone().startOf("day") : momentTZ().tz(timeZone).startOf("day");
  const startOfWeek = momentTZ().tz(timeZone).startOf('week');
  const duration = startOfToday.diff(startOfWeek);
  const diffDay = duration / 86400000;
  // case friday, saturday
  if (diffDay > 5) {
    return startOfWeek.add(5, 'day');
  } else {
    return startOfWeek.subtract(2, 'day');
  }
};

const syncDailyDataByDataSource = async (dataSource: string, today?: Moment) => {
  const { db } = mongoDb;
  if (db) {
    const dailyStepDataCollection = await db.collection(collections.dailyStepData);
    const usersCollection = await db.collection(collections.users);
    const allUsers = (await usersCollection.find().toArray()) as UserDataType[];
    const lastFriday = getLastFriday(today);
    const nextFriday = lastFriday.clone().add(7, "day");
    const lastFridayValue = lastFriday.valueOf();
    const nextFridayValue = nextFriday.valueOf();

    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const dailyFitnessData = await getDailyFitnessData(
        user.refresh_token,
        lastFridayValue,
        nextFridayValue,
        dataSource,
        86400000
      );
      if (dailyFitnessData) {
        const bucket = dailyFitnessData.bucket;
        for (let j = 0; j < bucket.length; j++) {
          const buck = bucket[j];
          const step = _.get(buck, 'dataset.0.point.0.value.0.intVal');
          if (step !== undefined) {
            const dataWillSave = {
              userId: user._id,
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
    }
  }
};

const syncDailyData = async (today?: Moment) => {
  for (let i = 0; i < dataSource.length; i++) {
    await syncDailyDataByDataSource(dataSource[i], today);
  }
};

export default syncDailyData;
