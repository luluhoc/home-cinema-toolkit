const axios = require('axios');
const normalizeUrl = require('normalize-url');
const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/schedule.json');
const db = low(adapter);

const settingsAdapter = new FileSync('db/settings.json');
const dbs = low(settingsAdapter);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.deleteByRating = async () => {
  dbs.read()
  const settings = await dbs.get('settings').value();
  console.log(settings)
  if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi || !settings.v3) {
    return console.log('NO SETTINGS')
  }
}