// ------------------------------
//  Imports
// ------------------------------
var responses = require('./utils/apiResponses.utils');
var Promise = require("bluebird");
var mail = require('../config/mail');
var mongoXlsx = require('mongo-xlsx');
var fs = require('fs');

// ------------------------------
//  Private
// ------------------------------


// ------------------------------
//  Public
// ------------------------------

module.exports = {
  getList: function (req, res) {

    req.db.collection('Invitado').find().toArray().then(function (data) {
      return new Promise(function (resolve, reject) {
        var model = mongoXlsx.buildDynamicModel(data);
        var confirmados = 0;
        var totalInvitados = 0;
        var i, n, x, y;

        for (i = 0, n = data.length; i<n; i++) {
          totalInvitados++;
          if (data[i].confirmado) {
            confirmados++;
          }

          if (Array.isArray(data[i].invitados) && data[i].invitados.length > 0) {
            for (x = 0, y = data[i].invitados.length; x<y; x++) {
              totalInvitados++;
              if (data[i].invitados[x].confirmado) {
                confirmados++;
              }
            }
          }
        }
        mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
          if (err) {
            return reject(err);
          }
          return resolve({path: data.fullPath, confirmados: confirmados, total: totalInvitados});
        });
      });
    }).then(function (obj) {
      return mail.sendInvitationList(obj.path, obj.confirmados, obj.total);
    }).then(function (fullPath) {
      return new Promise(function (resolve, reject) {
        fs.unlink(fullPath, function (err) {
          if (err) {
            return reject(err);
          }

          return resolve();
        });
      });
    }).then(function () {
      responses.successResponse(res, {});
    })
    .catch(function (e) {
      responses.errorResponse(res, e);
    });

  },

  getByName: function (req, res) {

    var searchQuery = {};

    if (req.params.firstName !== '') {
      searchQuery.firstName = {'$regex' : '.*' + req.params.firstName + '.*', '$options': 'i'};
    }

    if (req.params.secondName !== '') {
      searchQuery.lastName = {'$regex' : '.*' + req.params.secondName + '.*', '$options': 'i'};
    }

    if (req.params.lastName !== '') {
      searchQuery.secondLastName = {'$regex' : '.*' + req.params.lastName + '.*', '$options': 'i'};
    }

    req.db.collection('Invitado').find(searchQuery).toArray()
      .then(function (array) {
        if (array.length > 0) {
          responses.successResponse(res, {'Invitado': array[0]});
        } else {
          responses.successResponse(res, {});
        }

      })
      .catch(function (e) {
        console.log(e);
        responses.errorResponse(res, e);
      })

  },

  codeVerification: function (req, res) {

    if (!req.body.code) {
      return responses.customErrorResponse(res, 606);
    }

    req.db.collection('Invitado').find({code: req.body.code}).toArray()
      .then(function (array) {
        if (array.length > 0) {
          responses.successResponse(res, {'Invitado': array[0]});
        } else {
          responses.customErrorResponse(res, 607);
        }
      })
      .catch(function (e) {
        console.error(e);
        responses.errorResponse(e);
      });
      

  }
  
};
