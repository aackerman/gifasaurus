var formidable = require('formidable');
var util       = require('util');
var uuid       = require('uuid');
var spawn      = require('child_process').spawn;
var fs         = require('fs');
var glob       = require('glob');
var logger     = require(process.cwd() + '/app/lib/logger');

function GifasuarusUpload(req, res) {
  this.request = req;
  this.response = res;
  this.setupForm();
}

GifasuarusUpload.prototype.setupForm = function() {
  this.form = new formidable.IncomingForm();
  this.form.uploadDir = process.cwd() + '/tmp';
  this.form.keepExtensions = true;
  this.form.on('file', this.handleIncomingFile.bind(this));
  this.form.parse(this.request, this.uploadErrorHandler);
};

GifasuarusUpload.prototype.uploadErrorHandler = function(err, fields, files) {
  if (err) this.response.json({ error: { message: "Error uploading file" }});
};

GifasuarusUpload.prototype.spawnFFmpeg = function(file, tmpname, options) {
  options = options || {};

  logger.debug('Used:', ffmpegBin, ' for video to image conversion');

  return spawn(ffmpegBin, [
    '-i',
    file.path,
    '-r',
    10,
    '-vcodec',
    'png',
    process.cwd() + '/tmp/' + tmpname + '-%05d.png'
  ]);
};

GifasuarusUpload.prototype.spawnImageMagick = function(tmpfileGlobPath) {
  return spawn('convert', [
    '-verbose',
    '+dither',
    '-layers',
    'Optimize',
    tmpfileGlobPath,
    'GIF:-'
  ]);
};

GifasuarusUpload.prototype.spawnGifsicle = function() {
  return spawn('gifsicle', [
    '--colors',
    '128',
    '--delay=5',
    '--loop',
    '--optimize=3',
    '--multifile',
    '-'
  ]);
};

GifasuarusUpload.prototype.handleIncomingFile = function(name, file) {
  var self               = this;
  var tmpname            = uuid.v1();
  var tmpfileGlobPath    = [process.cwd(), '/tmp/', tmpname, '*.png'].join('');
  var outfilePath        = [process.cwd(), '/gifs/', tmpname, '.gif'].join('');
  var outfileWriteStream = fs.createWriteStream(outfilePath);

  var ffmpeg = this.spawnFFmpeg(file, tmpname);

  // handle other operations when ffmpeg is complete
  ffmpeg.on('close', function (code) {
    logger.info('ffmpeg close code: ', code);

    // handle error codes
    if (code !== 0) {
      self.response.json({ error: "Error during ffmpeg conversion" });
      return;
    }

    logger.info('ffmpeg completed creating image files from video');

    var imagemagick = this.spawnImageMagick(tmpfileGlobPath);
    var gifsicle = this.spawnGifsicle();

    imagemagick.on('error', function(err){
      logger.debug('imagemagick error', err);
    });

    imagemagick.stderr.pipe(process.stdout);

    imagemagick.stdout.pipe(gifsicle.stdin);
    gifsicle.stdout.pipe(outfileWriteStream);

    imagemagick.on('close', function(code){
      logger.info('imagemagick close code: ', code);
      if (code !== 0) {
        self.response.json({ error: "Error during imagemagick conversion" });
        outfileWriteStream.close();
        return;
      }
      logger.info('imagemagick conversion complete');
    });

    gifsicle.on('close', function(code){
      logger.info('gifsicle close code: ', code);

      if (code !== 0) {
        self.response.json({ error: "Error during gifsicle conversion" });
        return;
      }

      logger.info('gif file created');

      // respond to the user
      self.response.send({ file: {
        id: tmpname,
        filename: tmpname + '.gif'
      }});

      glob(tmpfileGlobPath, function(err, files){
        logger.info('deleting tmp files');
        files.forEach(fs.unlink);
      });
    });
  }.bind(this));
};

module.exports = GifasuarusUpload;
