var express          = require('express');
var app              = express();
var logger           = require(process.cwd() + '/app/lib/logger');
var UploadController = require(__dirname + '/app/controllers/upload-controller.js');

EXPRESSROOT = process.cwd();
APPROOT = EXPRESSROOT + '/app/';

app.set('port', 8000);
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({ secret: 'sauce' }));

app.post('/upload', UploadController);

app.configure('development', function(){
  app.use('/assets', express.static(APPROOT + '/assets'));
  app.use('/img', express.static(EXPRESSROOT + '/gifs'));
  app.use('/', express.static(EXPRESSROOT + '/public'));
});

app.listen(app.get('port'));
logger.info('starting app on', app.get('port'));
