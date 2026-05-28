const webErrorHandler = (err, req, res, next) => {
  const referer = req.headers.referer || '/web';
  const baseUrl = referer.split('?')[0];
  res.redirect(`${baseUrl}?error=${encodeURIComponent(err.message)}`);
};

module.exports = webErrorHandler;
