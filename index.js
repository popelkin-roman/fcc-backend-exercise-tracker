const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

let users = [];
let logs = [];

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/users', (req, res) => {
  let user;
  const userIndex = users.findIndex(v => v.username === req.body.username);
  if ( userIndex < 0) {
    user = getNewUser(req.body.username);
    users.push(user);
  } else {
    user = users[userIndex]
  }

  res.json(user);
})

app.get('/api/users', (req, res) => {
  res.json(users);
})

app.post('/api/users/:_id/exercises', (req, res) => {
  let _id = req.params._id;
  let description = req.body.description
  let duration = +req.body.duration
  let rawdate = req.body.date ? new Date(req.body.date) : new Date();
  let date = rawdate.toDateString();
  let username = users.find(v => v._id === _id).username;
  let exerciseObj = {
    description,
    duration,
    date,
  }
  let exercise = {
    username,
    ...exerciseObj,
    _id
  }
  let newLog;
  const logIndex = logs.findIndex(v => v._id === _id);
  if ( logIndex < 0) {
    newLog = {
      username,
      count: 1,
      _id,
      log: [{...exerciseObj}]
    };
    logs.push(newLog);
  } else {
    logs[logIndex].log.push({...exerciseObj})
    logs[logIndex].count++
  }
  res.json(exercise);
})

app.get('/api/users/:_id/logs', (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;

  let currentUserLog = {...logs.find(v => v._id === req.params._id)};
  if (from) {
    let filteredLog = currentUserLog.log.filter(el => new Date(el.date) >= new Date(from));
    currentUserLog.log = filteredLog;
  }
  if (to) {
    let filteredLog = currentUserLog.log.filter(el => new Date(el.date) <= new Date(to));
    currentUserLog.log = filteredLog;
  }
  if (limit) {
    currentUserLog.log.length = limit;
  }
  res.json(currentUserLog);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

function getNewUser(username) {
  let id = createRandomId(24);
  return {
    username,
    _id: id
  }
}

function createRandomId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}