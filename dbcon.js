var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_murrayho',
  password        : '8435',
  database        : 'cs340_murrayho'
});

module.exports.pool = pool;