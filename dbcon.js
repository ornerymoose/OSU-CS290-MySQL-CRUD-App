var credentials = require('./credentials.js');
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : credentials.host,
  user            : credentials.user,
  password        : credentials.password,
  database        : credentials.database,
});

module.exports.pool = pool;

