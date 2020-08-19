import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Button, notification, } from "antd";
import {getLoginUrl} from '../libs/oauth2';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import * as jwt from 'jsonwebtoken';
import {DailyFitnessData, UserDataType} from "../data";
import axios from 'axios';
import {LoadingOutlined} from "@ant-design/icons/lib";
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import moment from "moment";

export default function Home({ loginUrl }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserDataType | undefined>();
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
    const query = router.query;
    if (query.id_token) {
      localStorage.setItem('id_token', query.id_token as string);
      location.href = '/';
    }
  });

  useEffect(() => {
    const id_token = localStorage.getItem('id_token');
    if (id_token) {
      const currentUser: UserDataType = jwt.decode(id_token);
      setCurrentUser(currentUser);
      if (currentUser) {
        getDailyStepOfCurrentWeek(currentUser.email).then();
      }
    }
  }, []);

  const renderDailyStep = () => {
    if (isLoadingGetDailyStep) {
      return <LoadingOutlined style={{ fontSize: 30 }} />
    }
    if (dailyStepOfCurrentWeek) {
      const total = reduce(dailyStepOfCurrentWeek, (sum, d) => sum += d.step, 0);
      return (
        <div style={{ marginBottom: 50 }}>
          <h3>Total {total.toLocaleString()} steps</h3>
          <div>
          {map(dailyStepOfCurrentWeek, (d: DailyFitnessData) => (
            <div style={{ display: "flex", justifyContent: "space-between" }} key={d.startDate}>
              <span>{moment(parseInt(d.startDate)).format('ddd D/M')}:</span>
              <span>{d.step.toLocaleString()}</span>
            </div>
          ))}
          </div>
        </div>
      )
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>KiteMetric Helper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Sync Google Fit Project
        </h1>
      </main>

      <main className={styles.main}>
        {!currentUser ? (
          <a href={loginUrl}>
            <Button type="primary" danger size="large">Login with Google</Button>
          </a>
        ) : (
          <div style={{ display: "flex", flexDirection: "column"}}>
            <h3>Welcome {currentUser.name}</h3>
            <img src={currentUser.picture} style={{ width: '100%' }} alt="profile"/>
          </div>
        )}
      </main>

      {renderDailyStep()}

      <footer className={styles.footer}>
        Powered by KiteMetric's Employees
      </footer>
    </div>
  )
}


// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps() {
  return {
    props: {
      loginUrl: getLoginUrl(),
    },
  }
}
