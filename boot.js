var express          = require('express');
var app              = express();
var UploadController = require(__dirname + '/app/controllers/upload-controller.js');

EXPRESSROOT = process.cwd();
APPROOT = EXPRESSROOT + '/app/';

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({ secret: 'sauce' }));

app.use('/assets', express.static(APPROOT + '/assets'));
app.use('/img', express.static(EXPRESSROOT + '/gifs'));
app.post('/upload', UploadController);
app.use('/', express.static(EXPRESSROOT + '/public'));

app.listen(8000);
