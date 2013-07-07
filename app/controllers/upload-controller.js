var GifasuarusUpload = require(__dirname + '/../models/gifasaurus-upload.js');

module.exports = function(req, res) {
  new GifasuarusUpload(req, res);
};
