// small example route (not used directly in index.js right now)
module.exports = function (app) {
  app.get('/health', (req, res) => res.json({ status: 'ok', from: 'route' }));
}
