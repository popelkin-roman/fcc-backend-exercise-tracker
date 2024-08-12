const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

let users = [];

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/users', (req, res) => {
  let user;
  const userIndex = users.findIndex(v => v.username === req.body.username);
  if ( userIndex < 0) 
    user = getNewUser(req.body.username);
  else
    user = users[userIndex]
  res.json(user);
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
  for (let i = 0; i < characters.length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}