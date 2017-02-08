var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');

var mongoose = require('mongoose');
var url = 'mongodb://sheila1996:sheila1996@ds111559.mlab.com:11559/speech';

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

mongoose.connect(url);

mongoose.connection.once('open', function(res){
  console.log('connected');
});

app.get('/update', function(req,res){
  res.render('update');
});

  app.get('/add', function(req,res){
    res.render('add');
  });

var schema = new mongoose.Schema({
  title: String,
  speaker: String,
  date_delivered: String,
  locations: String,
  body: String,
  permalink: String,
  create_date: String,
  update_date: String
});

var user = mongoose.model('speeches', schema);
var usersArray = [];

app.post('/new/add', function(req, res){
  new user({
    title:req.body.title,
    speaker:req.body.speaker,
    date_delivered:req.body.date_delivered,
    locations: req.body.locations,
    body: req.body.body,
    permalink: req.body.permalink,
    create_date: req.body.create_date,
    update_date: req.body.update_date
  }).save(function(err, doc){
    if(err){
      console.log(err);
    } else {
      console.log('data added');
    }
  });
  res.redirect('/add');
});

app.get('/view', function(req, res){
  res.render('view');
});


//List all the entries
app.get('/speech', function(req, res) {
  user.find(function(err, users) {
    console.log('Speeches Loaded!');
    res.render('all_speeches', {
      title: 'All Entries',
      users: users
    });
  });
});

app.get('/speech/:speechId', function(req, res) {
    var speechId = req.params.speechId;
    user.findOne({_id: speechId}, function(err, users){
      console.log(users)
      res.render('display_speech', {
        title: user.title,
        user: users
      });
    }); 
  });

app.post('/speech/:speechId', function(req, res){

  var speechId = req.params.speechId;
  console.log(speechId);

  var newData = {
    title:req.body.title,
    speaker:req.body.speaker,
    date_delivered:req.body.date_delivered,
    locations: req.body.locations,
    body: req.body.body,
    permalink: req.body.permalink,
    create_date: req.body.create_date,
    update_date: req.body.update_date
  }
  console.log(speechId);
  user.update({_id: speechId}, {$set: newData}, function(err, result) {
    if(err) {
      console.log("Speech not updated!");
    }
    else {
      console.log("Speech Updated!")
      res.redirect('/speech/' + speechId)
    }
  }); 
});

app.get('/speech/:speechId/delete', function(req, res) {
    var speechId = req.params.speechId;
    user.findOne({_id: speechId}, function(err, users){
      console.log(users)
      res.render('update', {
        title: user.title,
        user: users
      });
    }); 
  });

app.get('/speech/:speechId/update', function(req, res) {
    var speechId = req.params.speechId;
    user.findOneAndRemove({_id: speechId}, function(req, res){
    console.log('data deleted')
  });
  res.render('/speech')
});

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
