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

  var locals = {
    wikipedias: wikipedias
  }

  if (req.query.query) {
    translate(req.query.query, function(err, translation) {
      locals.query = translation.query
      locals.translations = translation.translations
      res.render('index', locals);
    })
  } else {
    res.render('index', locals);
  }

});


app.listen(process.env.PORT || 5000)