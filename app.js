var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var licenseGrantsRouter = require('./routes/license-grants');
var disclaimerRouter = require('./routes/disclaimer');
var termsRouter = require('./routes/terms');
var apiHistoricalRouter = require('./routes/api_historical');
var apiTokenPriceRouter = require('./routes/api_tokenprice');
var apiRewardRouter = require('./routes/api_reward');
var apiVolumeRouter = require('./routes/api_volume');
var apiNftRouter = require('./routes/api_nft');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/license-grants', licenseGrantsRouter);
app.use('/disclaimer', disclaimerRouter);
app.use('/terms', termsRouter);
app.use('/api/historical',  apiHistoricalRouter);
app.use('/api/tokenprice',  apiTokenPriceRouter);
app.use('/api/reward',  apiRewardRouter);
app.use('/api/volume',  apiVolumeRouter);
app.use('/api/nft',  apiNftRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
