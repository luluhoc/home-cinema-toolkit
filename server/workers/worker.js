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
    const a = schedule.scheduleJob(jobs[0].time, function(){
      console.log(jobs[0].job);
    });
    const b = schedule.scheduleJob('*/1 * * * *', function(){
      console.log('Time for tea2!');
    });
  }
  
}
workerpool.worker({
  scheduleJob,
})