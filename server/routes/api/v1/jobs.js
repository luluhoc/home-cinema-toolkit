import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
import workerpool from 'workerpool'
// DB CONFIG

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/jobs.json');
const db = low(adapter);

// router
const router = express.Router();

const pool = workerpool.pool('./server/workers/worker.js');

(async () => {
  try {
    const worker = await pool.proxy();
    await worker.scheduleJob();
    console.log(pool.stats());
  } catch (error) {
    console.log(error)
  }
})()

// @route POST api/jobs/
// @desc ADD NEW JOB
// @access Public for users

router.post('/', async (req, res) => {
  db.defaults({ jobs: []})
  .write()
  db.get('jobs')
  .push({ id: 1, time: {hour: 17, minute: 16, dayOfWeek: null}, job: 'CONSOLE'})
  .write()
})

module.exports = router;