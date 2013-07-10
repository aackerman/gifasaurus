var GifasuarusUpload = require(__dirname + '/../models/gifasaurus-upload.js');

function all(req, res) {
  res.json({
    files: req.session.files || []
  });
}

function show(req, res) {
  res.json({
    files: { file: req.session.files[req.params.id] } || { file: {} }
  });
}

function create(req, res) {
  new GifasuarusUpload(req, res);
}

module.exports = {
  all: all,
  show: show,
  create: create
};
