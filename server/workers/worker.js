const workerpool = require('workerpool');
const schedule = require('node-schedule');
const low = require('lowdb');
// DB CONFIG
const fs = require('fs');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');
const {deleteByRating} = require('../workers/functions');
const adapter = new FileSync('db/jobs.json');
const db = low(adapter);
const scheduleJob = () => {
  fs.watchFile(path.join(__dirname, '../../', 'db', 'jobs.json'), { interval: 1000 }, (curr, prev) => {
    db.read()
    const jobs = db.get('jobs').value()
    if (jobs) {
      const a = schedule.scheduleJob(jobs[0].time, (a) => {
        console.log(a)
        console.log(jobs[0].jobType);
        console.log(jobs[0].variable)
      });
      const b = schedule.scheduleJob(jobs[1]?.time, (a) => {
        console.log(a)
        deleteByRating()
        console.log(jobs[1]?.jobType);
        console.log(jobs[1]?.variable)
      });
    }
  });
}
workerpool.worker({
  scheduleJob,
})