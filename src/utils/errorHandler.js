module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err.status) {
    res.status(err.status);
    return res.json({ error: err.message });
  }
  res.status(500);
  res.json({ error: 'Unknown error happened! '});
};
