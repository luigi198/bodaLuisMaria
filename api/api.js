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

    if (!req.body.email) {
      return responses.customErrorResponse(res, 600);
    }
    if (!req.body.password) {
      return responses.customErrorResponse(res, 601);
    }
    if (req.body.honeypot !== '') {
      return responses.customErrorResponse(res, 611);
    }

    var adminFound;

    req.db.collection('Admin').find({email: req.body.email}).toArray().then(function (admin) {
      return new Promise(function (resolve, reject) {
        if (admin.length === 0) {
          reject({code: 650});
        } else {
          if (admin[0].password !== req.body.password) {
            reject({code: 651});
          } else {
            adminFound = admin[0];
            resolve();
          }
        }
      });
    }).then(function () {
      return req.db.collection('Invitado').find().toArray();
    })
    .then(function (data) {
      return new Promise(function (resolve, reject) {
        var model = mongoXlsx.buildDynamicModel(data);
        var confirmados = 0;
        var totalInvitados = 0;
        var i, n, x, y;

        for (i = 0, n = data.length; i<n; i++) {
          totalInvitados = totalInvitados + data[i].cantidadInvitados;
          if (data[i].invitados) {
            confirmados = confirmados + data[i].invitados.length;
          }

          if (Array.isArray(data[i].invitados) && data[i].invitados.length > 0) {
            for (x = 0, y = data[i].invitados.length; x<y; x++) {
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
      return mail.sendInvitationList(obj.path, obj.confirmados, obj.total, adminFound.email);
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
      console.error(e);
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
        console.error(e);
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
        responses.errorResponse(res, e);
      });
      
  },

  addGuest: function (req, res) {

    if (!req.body.code) {
      return responses.customErrorResponse(res, 606);
    }

    if (!req.body.guest) {
      return responses.customErrorResponse(res, 608);
    }

    if (!req.body.guest.firstName || !req.body.guest.lastName) {
      return responses.customErrorResponse(res, 609);
    }

    var thisInvitado;

    req.db.collection('Invitado').find({code: req.body.code}).toArray()
      .then(function (array) {
        return new Promise(function (resolve, reject) {
          if (array.length > 0) {
            resolve(array[0]);
          } else {
            reject({code: 607});
          }
        });
      })
      .then(function (invitado) {
        if (invitado.cantidadInvitados > invitado.invitados.length) {
          invitado.invitados.push(req.body.guest);
          thisInvitado = invitado;
          return req.db.collection('Invitado').update({code: req.body.code}, {$set: {
            invitados: invitado.invitados
          }});
        } else {
          return Promise.reject({code: 610});
        }
      })
      .then(function () {
        responses.successResponse(res, {Invitado: thisInvitado});
      })
      .catch(function (e) {
        console.error(e);
        responses.errorResponse(res, e);
      });

  },

  removeGuest: function (req, res) {

    if (!req.body.code) {
      return responses.customErrorResponse(res, 606);
    }

    if (!req.body.guest) {
      return responses.customErrorResponse(res, 608);
    }

    var thisInvitado;

    req.db.collection('Invitado').find({code: req.body.code}).toArray()
      .then(function (array) {
        return new Promise(function (resolve, reject) {
          if (array.length > 0) {
            resolve(array[0]);
          } else {
            reject({code: 607});
          }
        });
      })
      .then(function (invitado) {
        var i, n;

        for (i = 0, n = invitado.invitados.length; i<n; i++) {
          if (invitado.invitados[i].firstName === req.body.guest.firstName && invitado.invitados[i].lastName === req.body.guest.lastName) {
            invitado.invitados.splice(i, 1);
            break;
          }
        }
        
        thisInvitado = invitado;

        return req.db.collection('Invitado').update({code: req.body.code}, {$set: {
          invitados: invitado.invitados
        }});
      })
      .then(function () {
        responses.successResponse(res, {Invitado: thisInvitado});
      })
      .catch(function (e) {
        console.error(e);
        responses.errorResponse(res, e);
      });

  }
  
};
