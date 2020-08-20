import React, {FC, useEffect, useState} from "react";
import {DailyFitnessData, UserDataType} from "../data";
import map from "lodash/map";
import moment from "moment";
import reduce from "lodash/reduce";
import {LoadingOutlined, SyncOutlined} from "@ant-design/icons/lib";
import axios from "axios";
import {notification, Avatar, Tooltip} from "antd";
import styles from '../styles/Home.module.css'

interface ProfileAtHomePropsType {
  currentUser: UserDataType;
}

const ProfileAtHome: FC<ProfileAtHomePropsType> = ({ currentUser }) => {
  const [isLoadingGetDailyStep, setIsLoadingGetDailyStep] = useState<boolean>(false);
  const [isReSyncDataFromGoogleFit, setIsReSyncDataFromGoogleFit] = useState<boolean>(false);
  const [dailyStepOfCurrentWeek, setDailyStepOfCurrentWeek] = useState<DailyFitnessData[] | undefined>();

  const loadDailyStepOfCurrentWeek = async (email: string) => {
    const res = await axios({
      method: "GET",
      url: '/api/get-daily-step-of-current-week-by-email',
      params: {
        email,
      }
    });
    if (res.data.error) {
      notification.error({
        message: 'Error',
        description: res.data.error,
      });
    } else {
      return res.data.data;
    }
  };

    const callReSyncWithGoogleFit = async (email: string) => {
      const res = await axios({
        method: "GET",
        url: '/api/re-sync-data-with-google-fit',
        params: {
          email,
        }
      });
      if (res.data.error) {
        notification.error({
          message: 'Error',
          description: res.data.error,
        });
      }
    };

  const getDailyStepOfCurrentWeek = async (email: string) => {
    setIsLoadingGetDailyStep(true);
    const data = await loadDailyStepOfCurrentWeek(email);
    setIsLoadingGetDailyStep(false);
    if (data) {
      setDailyStepOfCurrentWeek(data);
    }
  };

  useEffect(() => {
      getDailyStepOfCurrentWeek(currentUser.email).then();
  }, []);

  const onReSyncData = async () => {
    if (currentUser) {
      setIsReSyncDataFromGoogleFit(true);
      await callReSyncWithGoogleFit(currentUser.email);
      const data = await loadDailyStepOfCurrentWeek(currentUser.email);
      setIsReSyncDataFromGoogleFit(false);
      if (data) {
        setDailyStepOfCurrentWeek(data);
      }
    }
  };

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
          <h3
            className={styles.totalText}
          >
            Total {total.toLocaleString()} steps
            <Tooltip title="Sync from Google Fit Again!">
              <SyncOutlined
                onClick={!isReSyncDataFromGoogleFit ? onReSyncData : undefined}
                className={styles.reSyncIcon}
                spin={isReSyncDataFromGoogleFit}
                style={{ cursor: !isReSyncDataFromGoogleFit ? "pointer" : undefined}}
              />
            </Tooltip>
          </h3>
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
