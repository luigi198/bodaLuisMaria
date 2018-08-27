// controllers
// var main = require('../app/controllers/main')
var api = require('../api/api')
var path = require('path');

// -----------------------
// Expose
// -----------------------

module.exports = function(app, db) {
  
  app.use(function (req, res, next) {
    req.db = db;
    next()
  });

  //
  // API
  //
  app.post('/lista', api.getList);
  app.get('/byname/:firstName/:secondName/:lastName', api.getByName);
  
  // Listado de invitados
  app.get('/lista', function (req, res) {
    res.sendFile(path.join(__dirname, '../public', 'invitados.html'));
  });

  // index
  app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../public', 'index.html'));
	});

}
