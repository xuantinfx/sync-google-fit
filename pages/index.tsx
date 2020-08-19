import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Button } from "antd";
import {getLoginUrl} from '../libs/oauth2';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import * as jwt from 'jsonwebtoken';
import syncDailyData from "../jobs/syncDailyData";

export default function Home({ loginUrl }) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any | undefined>();

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
      setCurrentUser(jwt.decode(id_token));
    }
  }, []);

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

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
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
