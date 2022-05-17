const allowedCors = [
  'mestoru.nomoredomains.xy',
  'www.mestoru.nomoredomains.xy',
  'http://mestoru.nomoredomains.xyz/',
  'http://www.mestoru.nomoredomains.xyz/',
  'https://mestoru.nomoredomains.xyz/',
  'https://www.mestoru.nomoredomains.xyz/',
  'localhost:3000',
  'http://localhost:3000/',
];

const handleCors = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
 }

  next();
};

module.exports = handleCors;