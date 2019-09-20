const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

// const {getHomePage} = require('./routes/index');
// const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const port = process.env.REACT_APP_PORT || 8084;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// static assets
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.static(path.join(__dirname, 'build')));

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
  host: 'flow-replica-db.zymergen.net',
  user: username,
  password: password,
  database: 'flow',
});

// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

// routes for the app
/*
app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);
*/

app.get('/processModelDefs', function(req, res) {
  console.log('get /processModelDefs');
  db.query(`SELECT * from ACT_RE_PROCDEF group by NAME_ order by NAME_`, (err, result) => {
    res.send(result);
  });
});

const getLastUsedTimeQuery = (processModelName, version) => {
  return `(SELECT * 
  from ACT_RE_PROCDEF as p, ACT_HI_PROCINST as h 
  where h.PROC_DEF_ID_=p.ID_ and p.KEY_="${processModelName}" and p.VERSION_TAG_='${version}'
  order by h.END_TIME_ DESC
  limit 1)`;
};

app.post('/getLastUsedTime', function(req, res) {
  console.log('post /getLastUsedTime');
  const data = req.body;
  db.query(
    `SELECT distinct VERSION_TAG_ 
  from ACT_RE_PROCDEF
  where KEY_="${data.processModelName}" 
  order by VERSION_TAG_ DESC`,
    (err, result) => {
      const query = result
        .map((item) => getLastUsedTimeQuery(data.processModelName, item.VERSION_TAG_))
        .join('UNION ALL');
      db.query(query, (err, result) => {
        res.send(result);
      });
    },
  );
});

app.post('/bpmn', function(req, res) {
  console.log('post /bpmn');
  console.log(req.body);
  db.query(
    `SELECT * from ACT_GE_BYTEARRAY as b where b.DEPLOYMENT_ID_='${req.body.deploymentId}' and b.NAME_='${req.body.resourceName}'`,
    (err, result) => {
      console.log(result);
      res.send(result);
    },
  );
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.post('/versionsInUse', function(req, res) {
//   console.log('post /versionsInUse');
//   const data = req.body;
//   db.query(
//     `
//     SELECT *
//     from ACT_RE_PROCDEF as p, ACT_HI_PROCINST as h
//     where h.PROC_DEF_ID_=p.ID_ and h.END_TIME_>='${data.startDate}' and p.KEY_="${data.processModelName}"
//     group by p.VERSION_TAG_
//     order by VERSION_ DESC`,
//     (err, result) => {
//       console.log(result);
//       res.send(result);
//     },
//   );
// });

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
