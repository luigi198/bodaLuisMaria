var Promise = require("bluebird");
var MongoClient = require("mongodb").MongoClient;
var DBConnectionString = process.env.MONGODB_URI;
var databaseConnection;

module.exports = {
  createConnection: function () {    
    return MongoClient.connect(DBConnectionString, {
        promiseLibrary: Promise
      });
  },
  setupConnection: function (db) {
    databaseConnection = db;
  },
  getConnection: function () {
    return databaseConnection;
  }
};
