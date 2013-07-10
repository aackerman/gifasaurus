var express          = require('express');
var app              = express();
var logger           = require(process.cwd() + '/app/lib/logger');
var UploadController = require(__dirname + '/app/controllers/upload-controller.js');
var FilesController  = require(__dirname + '/app/controllers/files-controller.js');

EXPRESSROOT = process.cwd();
APPROOT = EXPRESSROOT + '/app/';

app.set('port', 8000);
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({ secret: 'sauce' }));
app.use(function(req, res, next){
  req.session.files = req.session.files || [];
  next();
});

app.post('/upload', UploadController);
app.get('/files', FilesController.all);
app.get('/files/:id', FilesController.show);

app.configure('development', function(){
  app.use('/assets', express.static(APPROOT + '/assets'));
  app.use('/img', express.static(EXPRESSROOT + '/gifs'));
  app.use('/', express.static(EXPRESSROOT + '/public'));
});

app.listen(app.get('port'));
logger.info('starting app on', app.get('port'));
