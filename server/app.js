var express = require('express'),
    path = require('path'),
    config = require('./commons/config');

// Make app available to other modules as well
app = module.exports = express.createServer();

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
app.use(express.compiler({ src : __dirname + '../public', enable: ['less']}));
  app.use(app.router);
  app.use(express.static(path.resolve(__dirname,'../public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Now less files with @import 'whatever.less' will work(https://github.com/senchalabs/connect/pull/174)
var TWITTER_BOOTSTRAP_PATH = '../vendor/twitter/bootstrap/less';
express.compiler.compilers.less.compile = function(str, fn) {
  try {
    var less = require('less');var parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});
    parser.parse(str, function(err, root){fn(err, root.toCSS());});
  } catch (err) {fn(err);}
}

// Routes
require('./routes');

app.listen(config.web.port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});