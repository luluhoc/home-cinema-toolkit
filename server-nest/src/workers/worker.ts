import workerpool from 'workerpool';
import schedule from 'node-schedule';
import low from 'lowdb';
// DB CONFIG
import fs from 'fs';
import path from 'path';
import { deleteByRating } from './functions';

let active = false;
function tickForward(func, jobs) {
  if (!active) {
    active = true;

    func(jobs);
    active = false;
  }
}
const jobsObj = {
  job1(jobs) {
    schedule.scheduleJob(jobs[0]?.time, (a) => {
      deleteByRating(jobs[0]?.variable);
    });
  },
  // job2(jobs) {
  //   schedule.scheduleJob(jobs[1]?.time, (a) => {
  //     console.log(a);
  //     console.log(jobs[1]?.jobType);
  //     console.log(jobs[1]?.variable);
  //   });
  // },
};
const adapter = new FileSync('db/jobs.json');
const db = low(adapter);
const scheduleJob = () => {
  db.read();
  const jobs = db.get('jobs').value();
  if (jobs) {
    if (jobs[0] && jobs[0].on) {
      tickForward(jobsObj.job1, jobs);
    }
  }
  fs.watchFile(
    path.join(__dirname, '../../', 'db', 'jobs.json'),
    {
      interval: 1000,
    },
    () => {
      db.read();
      const jobsa = db.get('jobs').value();
      if (jobsa) {
        if (jobsa[0] && jobsa[0].on) {
          tickForward(jobsObj.job1, jobsa);
        }
      }
    },
  );
};
workerpool.worker({
  scheduleJob,
});
