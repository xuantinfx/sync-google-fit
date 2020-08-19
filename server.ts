import syncDailyData from "./jobs/syncDailyData";
const { initDb } = require('./db/mongodb');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const CronJob = require('cron').CronJob;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

initDb().then();

const scheduleCronJob = '49 13 * * *';

const job = new CronJob(scheduleCronJob, async () => {
  console.log('Begin sync data from Google Fit');
  await syncDailyData();
}, null, true, 'Asia/Ho_Chi_Minh');
job.start();

console.log('Start job at', scheduleCronJob);

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000')
  });
});
