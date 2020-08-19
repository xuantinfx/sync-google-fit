import React, {FC, useEffect, useState} from "react";
import {DailyFitnessData, UserDataType} from "../data";
import map from "lodash/map";
import moment from "moment";
import reduce from "lodash/reduce";
import {LoadingOutlined} from "@ant-design/icons/lib";
import axios from "axios";
import {notification, Avatar} from "antd";
import styles from '../styles/Home.module.css'

interface ProfileAtHomePropsType {
  currentUser: UserDataType;
}

const ProfileAtHome: FC<ProfileAtHomePropsType> = ({ currentUser }) => {
  const [isLoadingGetDailyStep, setIsLoadingGetDailyStep] = useState<boolean>(false);
  const [dailyStepOfCurrentWeek, setDailyStepOfCurrentWeek] = useState<DailyFitnessData[] | undefined>();

  const getDailyStepOfCurrentWeek = async (email: string) => {
    setIsLoadingGetDailyStep(true);
    const res = await axios({
      method: "GET",
      url: '/api/get-daily-step-of-current-week-by-email',
      params: {
        email,
      }
    });
    setIsLoadingGetDailyStep(false);
    if (res.data.error) {
      notification.error({
        message: 'Error',
        description: res.data.error,
      });
    } else {
      setDailyStepOfCurrentWeek(res.data.data);
    }
  };

  useEffect(() => {
      getDailyStepOfCurrentWeek(currentUser.email).then();
  }, []);

  const total = reduce(dailyStepOfCurrentWeek, (sum, d) => sum += d.step, 0);
  return (
    <div>
      <div className={styles.profileNameAndAvatar}>
        <h3 className={styles.profileName}>Welcome {currentUser.name}</h3>
        <Avatar src={currentUser.picture} size={100}/>
        {isLoadingGetDailyStep && (<LoadingOutlined style={{ fontSize: 30, marginTop: 20 }} />)}
      </div>
      {!isLoadingGetDailyStep && dailyStepOfCurrentWeek && (
        <div>
          <h3 className={styles.totalText}>Total {total.toLocaleString()} steps</h3>
          <div>
            {map(dailyStepOfCurrentWeek, (d: DailyFitnessData) => (
              <div style={{ display: "flex", justifyContent: "space-between" }} key={d.startDate}>
                <span>{moment(parseInt(d.startDate)).format('ddd DD/MM')}:</span>
                <span>{d.step.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
};

export default ProfileAtHome;
