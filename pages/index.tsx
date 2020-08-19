import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Button, Row, Col} from "antd";
import {getLoginUrl} from '../libs/oauth2';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import * as jwt from 'jsonwebtoken';
import { UserDataType} from "../data";
import ProfileAtHome from "../components/ProfileAtHome";
import Leaderboard from "../components/Leaderboard";

export default function Home({ loginUrl }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserDataType | undefined>();

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
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>KiteMetric Helper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>
        Welcome to Sync Google Fit Project
      </h1>

      {!currentUser ? (
        <div className={styles.loginButtonContainer}>
          <a href={loginUrl}>
            <Button style={{ marginBottom: 20 }} type="primary" danger size="large">Login with Google</Button>
          </a>
        </div>
      ) : (
        <Row justify="space-around" style={{ marginBottom: 20, flex: 1 }}>
          <Col lg={9} md={24}>
            <ProfileAtHome
              currentUser={currentUser}
            />
          </Col>
          <Col lg={9} md={24}>
            <Leaderboard />
          </Col>
        </Row>
      )}

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
