var express = require('express')
var logfmt = require('logfmt')
var merge = require('merge')
var cors = require('cors')
var translate = require('wikipedia-translator')
var wikipedias = require('wikipedias')
var app = module.exports = express()

if (process.env.NODE_ENV !== "test") app.use(logfmt.requestLogger());
app.use(express.static(__dirname + "/public"))
app.set('view engine', 'jade');

app.get('/', cors(), function(req, res) {

  var locals = {
    wikipedias: wikipedias,
    hostname: req.hostname
  }

  // Support the old URL format
  if (req.query.query) {
    var url = require("url").format({
      pathname: "/search",
      query:req.query
    })
    return res.redirect(url)
  }

  res.render('index', locals)

});

app.get('/search', cors(), function(req, res) {

  var locals = {
    wikipedias: wikipedias,
    hostname: req.hostname
  }

  // Query param is required
  if (!req.query || !req.query.query) {
    return res.redirect("/")
  }

  // English is the default language
  req.query.lang || (req.query.lang = 'en')

  // Log it so we can watch the queries go by
  if (process.env.NODE_ENV !== "test")
    logfmt.log(req.query)

  translate(req.query.query, req.query.lang, function(err, translation) {

    // "/search?query="+ t.word.toLowerCase() + "&lang=" + t.lang

    if (req.query.format && req.query.format.match(/json/)) {
      res.json(merge(locals, translation))
    } else {
      res.render('search', merge(locals, translation))
    }
  })

});


if (!module.parent) {
  var port = process.env.PORT || 5000
  app.listen(port, function() {
    console.log("App running on port %s", port)
  })
}
