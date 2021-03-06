import express from 'express';
import low from 'lowdb';
import workerpool from 'workerpool';

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
  } catch (error) {
    console.log(error);
  }
})();

// @route POST api/jobs/
// @desc ADD NEW JOB
// @access Public for users

router.post('/', async (req, res) => {
  const { jobType, time, variable } = req.body;
  if (jobType && jobType === 'byAge') {
    return res.status(500).json({ errors: [{ msg: 'This is not supported yet :)' }] });
  }
  if (jobType && (jobType === 'rating' || jobType === 'byAge')) {
    console.log(req.body);
    try {
      db.read();
      db.defaults({ jobs: [] })
        .write();
      db.get('jobs')
        .find({ jobType })
        .assign({ time, jobType, variable })
        .write();
      const jobs = db.get('jobs');
      res.json(jobs);
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: [{ msg: 'Server Error - Adding JOBS' }] });
    }
  }
});

// @route GET api/jobs/
// @desc GET JOBS
// @access Public for users

router.get('/', async (req, res) => {
  db.read();
  try {
    const jobs = db.get('jobs').value();
    res.json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server Error - Getting JOBS' }] });
  }
});

// @route PATCH api/jobs/switch
// @desc Switch JOBS
// @access Public for users

router.patch('/switch', async (req, res) => {
  const { jobType, on } = req.body;
  console.log(on);
  db.read();
  try {
    db.get('jobs')
      .find({ jobType })
      .assign({ on: !on })
      .write();
    const jobs = db.get('jobs');
    res.json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server Error - Switch' }] });
  }
});

module.exports = router;
