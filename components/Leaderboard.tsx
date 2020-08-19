import React, {FC, useEffect, useState} from "react";
import {LeaderboardDataType} from "../data";
import axios from "axios";
import {notification, Avatar} from "antd";
import {LoadingOutlined} from "@ant-design/icons/lib";
import map from "lodash/map";
import styles from '../styles/Home.module.css'

interface LeaderboardPropsType {

}

const Leaderboard: FC<LeaderboardPropsType> = () => {
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardDataType[] | undefined>();

  const getLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    const res = await axios({
      method: "GET",
      url: '/api/get-leaderboard',
    });
    setIsLoadingLeaderboard(false);
    if (res.data.error) {
      notification.error({
        message: 'Error',
        description: res.data.error,
      });
    } else {
      setLeaderboard(res.data.data);
    }
  };

  useEffect(() => {
    getLeaderboard().then();
  }, []);

  return (
    <div>
      <div className={styles.leaderboardHeader}>
        <h3>Leaderboard</h3>
        {isLoadingLeaderboard && (<LoadingOutlined style={{ fontSize: 30 }} />)}
      </div>
      {!isLoadingLeaderboard && leaderboard && (
        <div className={styles.leaderboardContent}>
          {map(leaderboard, (d: LeaderboardDataType) => (
            <div className={styles.leaderboardItem} key={d._id}>
              <div>
                <Avatar src={d.picture}/>
                <span style={{ marginLeft: 5 }}>{d.given_name}</span>
              </div>
              <span>{d.totalStep.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

export default Leaderboard;
