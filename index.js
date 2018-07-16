var express = require('express');
var app = express();
var bodyparser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

var DB = require('./config/db');

//start connection
DB.createConnection().then(function (db) {
  DB.setupConnection(db);

  // Config API Routes
  require('./config/routes')(app, DB.getConnection());
  //Starts Server Port
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
  //In case there's any error inside the then 
}).catch(function(err) {
  console.error("ERROR: ", err);
});
