// Vercel serverless function entry point
// Ensures Express routes defined with "/api/*" in server.js still work when mounted at "/api" on Vercel

const app = require('../server');

module.exports = (req, res) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};

