const handleCors = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = "GET, HEAD, PUT, PATCH, POST, DELETE";

  res.header('Access-Control-Allow-Origin', '*');

  if (method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', 'Authorization, set-cookie, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    return res.end();
 }

  next();
};

module.exports = handleCors;
