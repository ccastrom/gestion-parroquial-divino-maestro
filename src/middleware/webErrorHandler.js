const webErrorHandler = (err, req, res, next) => {
  const referer = req.headers.referer || '/web';
  res.redirect(`${referer}?error=${encodeURIComponent(err.message)}`);
};

module.exports = webErrorHandler;
