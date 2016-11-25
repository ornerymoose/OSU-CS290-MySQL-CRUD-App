var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})); //needed for req.body

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT *, DATE_FORMAT(date, "%Y-%m-%d") AS date FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.render('home', {rows: rows});
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.post('/insert', function(req, res) {
    if (req.body.lbs === "true") {
        req.body.lbs = 1;
    }
    else {
        req.body.lbs = 0;
    }
    mysql.pool.query("INSERT INTO workouts SET ?", req.body, function(err, results) {
    	if (err) {
    		console.log("INSERT err: " + err);
			return;
        }
        req.body.id = results.insertId;
        res.send(req.body);
    });
});

app.post('/delete', function(req, res, next) {
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result) {
        if(err) {
            next(err);
            return;
        }
        res.send(req.body);
    });
});

app.get('/update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
       	[req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
        function(err, result){
        if(err){
        	console.log("ERR: " + err);
          next(err);
          return;
        }
        console.log(result.changedRows);
        context.results = "Updated " + result.changedRows + " rows.";
        res.send(context);
      });
    }
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});