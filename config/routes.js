// controllers
// var main = require('../app/controllers/main')
// var api = require('../app/controllers/api')
var path = require('path');

// -----------------------
// Expose
// -----------------------

module.exports = function(app) {
  // SPA
  app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'public', 'layout.html'));
	})

  //
  // API
  //
  // app.get('/api/helloworld', api.helloworld)
}
