import {Moment} from "moment";
import momentTZ from "moment-timezone";
const timeZone = 'Asia/Ho_Chi_Minh';

export const getLastFriday = (today?: Moment) => {
  const startOfToday = today ? today.clone().startOf("day") : momentTZ().tz(timeZone).startOf("day");
  const startOfWeek = momentTZ().tz(timeZone).startOf('week');
  const duration = startOfToday.diff(startOfWeek);
  const diffDay = duration / 86400000;
  // case saturday move to next week
  if (diffDay > 5) {
    return startOfWeek.add(5, 'day');
  } else {
    return startOfWeek.subtract(2, 'day');
  }
};
