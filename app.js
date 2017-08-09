var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');
var businessObjs = require('./routes/business_objects');
var environments = require('./routes/enviroments');
var deploy = require('./routes/deploy');
var ser_reg = require('./routes/service_registry');
var sc_h = require('./routes/scripts_handling');
var db_h = require('./routes/db_handling');
var rest_h = require('./routes/rest_handling');
var decision_h = require('./routes/decision_handling');
var end_h = require('./routes/end_handling');
var beginObjs = require('./routes/begin_objects');
var endObjs = require('./routes/end_objects');
var mscomp_h = require('./routes/mscomp_handling');

var mongo = require('mongodb');
var monk = require('monk');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/views'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/'));
//Store all JS and CSS in base folder.

var db = monk('localhost:27017/msplatform', function(err, db){
    if(err){
       console.error("Db is not connected", err.message);
    }
    else
    {
        console.log("Db is connected");
    }
});


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/projects',projects);
app.use('/business_objects',businessObjs);
app.use('/envs',environments);
app.use('/deploy',deploy);
app.use('/serreg',ser_reg);
app.use('/sch',sc_h);
app.use('/dbh',db_h);
app.use('/resth',rest_h);
app.use('/dech',decision_h);
app.use('/endh',end_h);
app.use('/begin_objects',beginObjs);
app.use('/end_objects',endObjs);
app.use('/mscomph',mscomp_h);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
