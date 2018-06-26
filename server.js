const express = require('express');
const morgan = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/api/test', (req, res) => {
  res.json({
    message: 'hello world',
  });
});

app.get('/api/db', (req, res) => {
  const db = new sqlite3.Database('sample.sqlite3');
  db.serialize(function() {
    db.all('SELECT id,name FROM users', function(err, rows) {
      res.json(rows);
    });
  });
  db.close();
});

// The "catch all" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`server listening on ${port}`); // eslint-disable-line no-console
