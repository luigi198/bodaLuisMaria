var sendinblue = require('sendinblue-api');
var responses = require('../api/utils/apiResponses.utils');
var Promise = require('bluebird');
var fs = require('fs');

var parameters = { "apiKey": process.env.SENDINBLUE_API_KEY };	//Optional parameter: Timeout in MS
var sendinObj = new sendinblue(parameters);

var dataTemplate = {
	"to" : {},
	"from" : [],
	"subject" : "",
	"html" : ""
};

var getTemplate = function () {
	var aux = {};
	for (var x in dataTemplate) {
		aux[x] = dataTemplate[x];
	}
	return aux;
};

var encodeFileToBase64 = function (file) {
	// read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};

var sendInvitationList = function (path, confirmados, total) {
	return new Promise(function (resolve, reject) {
		var emailBody = getTemplate();
		emailBody.to['luis.cordoba198@gmail.com'] = 'Luis Córdoba';
		emailBody.to['mfdrexer19@gmail.com'] = 'María Drexler';
		emailBody.from.push('luis.cordoba@ibux.co.cr');
		emailBody.from.push('Luis Córdoba');
		emailBody.subject = 'Lista de Invitados';
		emailBody.attachment = {'listaInvitados.xlsx': encodeFileToBase64(path)};
		emailBody.html = '<h1>La lista de Invitados actualizada</h1><h3>Cantidad de confirmados: ' + confirmados + ' de ' + total + '</h3><p>Este correo fue solicitado para recibir la lista de invitados actualizada para la boda de María Drexler y Luis Córdoba.</p>';
		// sendinObj.send_email(emailBody, function (err, data) {
		// 	if (err) {
		// 		return reject(err);
		// 	}
		// 	return resolve(path);
		// });

		//delete
		return resolve(data);
	});
};

module.exports = {
  sendInvitationList: sendInvitationList
};
