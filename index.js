var express = require('express')
var logfmt = require('logfmt')
var translate = require('wikipedia-translator')
var wikipedias = require('wikipedias')
var app = express()

app.configure(function() {
  if (process.env.NODE_ENV !== "test") app.use(logfmt.requestLogger());
  app.use(app.router);
  app.use('/', express.static('public'));
  app.set('view engine', 'jade');
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/search', function(req, res) {
  translate(req.query.q, function(err, translation) {
    // res.json(translation);
    translation.wikipedias = wikipedias;
    console.log(wikipedias);
    res.render('search', translation);
  })
});

app.listen(process.env.PORT || 5000)