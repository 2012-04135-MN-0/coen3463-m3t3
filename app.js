var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var add = require('./routes/add');
var view = require('./routes/view');
var update = require('./routes/update');


var app = express();
var db;

var mdbUrl = "mongodb://admin:administrator@ds159978.mlab.com:59978/coen3463-t3"
MongoClient.connect(mdbUrl, function(err, database){
	if (err) {
		console.log(err)
		return;
	}

	console.log("Connected to DB!");

	db=database

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
	app.use('/add', add);
	app.use('/view', view);
	app.use('/update', update);

	app.get('/add', function(req, res){
		var speechCollection = db.collection.('speeches');
		speechCollection.find().toArray(function(err, speeches) {
			console.log(' Speeches loaded', speeches);
		  res.render('speeches', {
		  	speeches: speeches
		  });
		})
	})



    app.post('/add', function(req, res) {
        console.log(req.body);
        var dataToSave = {
            Title: req.body.title,
            Speaker: req.body.speaker,
            DateDelivered: req.body.date_delivered,
        };
        db.collection('speeches')
          .save(dataToSave, function(err, speeches) {
            if (err) {
                console.log('Saving Data Failed!');
                return;
            }
            console.log("Saving Data Successfull!");
            res.redirect('/add');
        })
    });

})



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
