const workerpool = require('workerpool');
const schedule = require('node-schedule');
const low = require('lowdb');
// DB CONFIG

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/jobs.json');
const db = low(adapter);
db.read()

const scheduleJob = () => {
  const jobs = db.get('jobs').value()
  if (jobs) {
    const a = schedule.scheduleJob(jobs[0].time, (a) => {
      console.log(a)
      console.log(jobs[0].jobType);
      console.log(jobs[0].variable)
    });
    const b = schedule.scheduleJob(jobs[1]?.time, (a) => {
      console.log(a)
      console.log(jobs[1]?.jobType);
      console.log(jobs[1]?.variable)
    });
  }
  
}
workerpool.worker({
  scheduleJob,
})