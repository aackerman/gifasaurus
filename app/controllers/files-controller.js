
function all(req, res) {
  req.session.files = req.session.files || [];
  res.json(req.session.files);
}

function show(req, res) {
  var files = req.session.files;
  if (files.length) {
    res.json(req.session.files);
  } else {
    res.json([]);
  }
}

module.exports = {
  all: all,
  show: show
};
