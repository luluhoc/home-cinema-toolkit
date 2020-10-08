import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
import fs from 'fs';
const {spawn} = require('child_process');
import path from 'path'
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
    console.log(error);
  }
})()

// @route POST api/jobs/
// @desc ADD NEW JOB
// @access Public for users

router.post('/', async (req, res) => {
  const { jobType, time, variable } = req.body;
  if (jobType && (jobType === 'rating' || jobType === 'byAge')) {
    db.read()
    db.defaults({ jobs: []})
    .write()
    db.get('jobs')
    .push({ time, jobType, variable })
    .write()
  }
})

module.exports = router;