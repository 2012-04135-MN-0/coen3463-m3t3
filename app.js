var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var view = require('./routes/view');
var update = require('./routes/update');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var app = express();


var url = 'mongodb://sheila1996:sheila1996@ds111559.mlab.com:11559/speech';
MongoClient.connect(url, function(err, database) {
    if (err) {
        console.log(err)
        return;
    }

    console.log("Connected to DB!");



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
	app.use('/view', view);
	app.use('/update', update);

	app.get('/add', function(req, res, next){
		var resultArray = [];
		MongoClient.connect(url, function(err, db){
			assert.equal(null, err);
			var cursor = db.collection('speeches').find();
			cursor.forEach(function(doc, err){
				assert.equal(null, err);
				resultArray.push(doc);
			}, function(){
				db.close();
				res.render('add',{collect: resultArray});
			});
		});
	});

	app.post('/add', function(req, res, next){
		var collect = {
			title: req.body.title,
			speaker: req.body.speaker
		};
		MongoClient.connect('url', function(err, db){
			assert.equal(null, err);
			db.collection('speeches').insertOne(collect, function(err, result){
				assert.equal(null, err);
				console.log('success');
				db.close();
			});
		});
		res.redirect('/');
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
});
module.exports = app;