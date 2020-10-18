import low from 'lowdb';
// DB CONFIG

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/jobs.json');
const db = low(adapter);

db.read()

var j = schedule.scheduleJob({
  hour: 14,
  minute: 30,
  dayOfWeek: 0
}, function () {
  console.log('Time for tea!');
});