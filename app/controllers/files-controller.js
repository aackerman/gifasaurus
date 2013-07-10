
function all(req, res) {
  res.json({
    files: req.session.files || []
  });
}

function show(req, res) {
  res.json({
    files: req.session.files[req.params.id] || { file: [] }
  });
}

module.exports = {
  all: all,
  show: show
};
