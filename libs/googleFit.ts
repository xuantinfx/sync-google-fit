import {getAccessToken} from "./oauth2";
import axios from 'axios';

export const getDailyFitnessData = async (
  refresh_token: string,
  startTimeMillis: number,
  endTimeMillis: number,
  dataSourceId: string,
  durationMillis = 86400000
) => {
  const accessToken = await getAccessToken(refresh_token);
  const res = await axios({
    url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      "aggregateBy": [
        {
          "dataTypeName": "com.google.step_count.delta",
          "dataSourceId": dataSourceId
        }
      ],
      "bucketByTime": {
        "durationMillis": durationMillis
      },
      "startTimeMillis": startTimeMillis,
      "endTimeMillis": endTimeMillis
    }
  });
  return res.data;
};
