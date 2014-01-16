var express = require('express')
var logfmt = require('logfmt')
var merge = require('merge')
var cors = require('cors')
var translate = require('wikipedia-translator')
var wikipedias = require('wikipedias')
var app = module.exports = express()

app.configure(function() {
  if (process.env.NODE_ENV !== "test") app.use(logfmt.requestLogger());
  app.use(app.router);
  app.use('/', express.static('public'));
  app.set('view engine', 'jade');
});

app.get('/', cors(), function(req, res) {

  var locals = {
    wikipedias: wikipedias
  }

  if (req.query.query) {
    // English is the default language
    req.query.lang || (req.query.lang = 'en')

    // Log it so we can watch the queries go by
    if (process.env.NODE_ENV !== "test")
      logfmt.log(req.query)

    translate(req.query.query, req.query.lang, function(err, translation) {
      if (req.query.format && req.query.format.match(/json/)) {
        res.json(merge(locals, translation))
      } else {
        res.render('index', merge(locals, translation))
      }
    })
  } else {
    res.render('index', locals)
  }

});

if (!module.parent) {
  app.listen(process.env.PORT || 5000)
}