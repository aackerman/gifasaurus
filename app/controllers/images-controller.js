
module.exports = function(req, res) {
  res.send(req.session.files);
};
