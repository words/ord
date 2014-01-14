var express = require('express')
var logfmt = require('logfmt')
var merge = require('merge')
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
    // English is the default language
    req.query.lang || (req.query.lang = 'en')

    // Log it so we can watch the queries go by
    logfmt.log(req.query)

    translate(req.query.query, req.query.lang, function(err, translation) {
      res.render('index', merge(locals, translation))
    })
  } else {
    res.render('index', locals)
  }

});


app.listen(process.env.PORT || 5000)