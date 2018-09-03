var typingMethod;
var ratio = 1.3;
var invitado = null;
var userLoaded = false;

var getFlipbookSize = function (windowWidth, flipbook) {
	var width = 0;
	var height = 0;

	if (windowWidth > 1000) {
		width = 1000;
	} else if (windowWidth > 500) {
		width = windowWidth * 0.9;
	} else {
		width = windowWidth * 0.95;
	}

	height = Math.floor(width / ratio);

	flipbook.turn('size', width, height);
};

var getGuestName = function (url) {
	var urlSplit = url.split('name=');
	var aux = decodeURI(urlSplit[1]);

	return aux === 'undefined' ? '' : aux;
};

var removeGuest = function () {
	$('.removeGuest').click(function () {
		var elementId = $(this).attr('id');
		var guestNumber = elementId.split('guestDataNumber')[1];
		var obj = {
			code: invitado.code,
			guest: invitado.invitados[guestNumber]
		};

		$.post('/removeGuest', obj, function (response) {
			$('#guestDataContainer' + guestNumber).remove();
			invitado.invitados.splice(guestNumber, 1);
			addGuestInfo(invitado.cantidadInvitados - invitado.invitados.length);
		});
	});
};

var addGuest = function () {
	$('.addGuest').click(function () {
		var elementId = $(this).attr('id');
		var guestNumber = elementId.split('guestNumber')[1];
		var guestObj = {
			firstName: $('#guestName' + guestNumber).val(),
			lastName: $('#guestLastName' + guestNumber).val(),
			secondLastName: $('#guestSecondLastName' + guestNumber).val()
		};
		var validObj = true;

		if (guestObj.firstName === '') {
			$('#guestName' + guestNumber).addClass('is-invalid');
			$('#errorMsgFirstName' + guestNumber).show('slow');
			validObj = false;
		} else {
			$('#guestName' + guestNumber).removeClass('is-invalid');
			$('#errorMsgFirstName' + guestNumber).hide('slow');
		}
		if (guestObj.lastName === '') {
			$('#guestLastName' + guestNumber).addClass('is-invalid');
			$('#errorMsgLastName' + guestNumber).show('slow');
			validObj = false;
		} else {
			$('#guestLastName' + guestNumber).removeClass('is-invalid');
			$('#errorMsgLastName' + guestNumber).hide('slow');
		}

		if (validObj) {
			var body = {code: invitado.code, guest: {}};
			for (var k in guestObj) {
				body.guest[k] = guestObj[k];
			}

			$.post('/addGuest', body, function (response) {
				$('#guestContainer' + guestNumber).remove();
				invitado.invitados.push(guestObj);
				addGuestData(guestObj, invitado.invitados.length - 1);
			});
		}

	});
};

var addGuestData = function (data, i) {
	$('#guestsInformation').append('<div id="guestDataContainer' + i + '" style="margin-bottom: 10px;"><p>Invitado:</p><p style="font-weight: bold;">' + data.firstName + ' ' + data.lastName + ' ' + data.secondLastName + '</p><button id="guestDataNumber' + i + '" type="button" class="btn btn-danger removeGuest">Cancelar</button></div>')
};

var addGuestInfo = function (i) {
	$('#guestsData').append('<div id="guestContainer' + i + '" style="margin-bottom: 10px;"><p>Invitado:</p><input id="guestName' + i + '" type="text" class="form-control guestData" placeholder="Nombre" /><div id="errorMsgFirstName' + i + '" class="alert alert-danger" style="display: none;" role="alert">El Nombre es requerido!</div><input type="text" id="guestLastName' + i + '" class="form-control guestData" placeholder="Primer Apellido" /><div id="errorMsgLastName' + i + '" class="alert alert-danger" style="display: none;" role="alert">El Apellido es requerido!</div><input type="text" id="guestSecondLastName' + i + '" class="form-control guestData" placeholder="Segundo Apellido" /><button id="guestNumber' + i + '" type="button" class="btn btn-success addGuest">Agregar</button></div>');
};

var loadCode = function (code) {
	$.post('/loadCode', {code: code}, function (response) {
		invitado = response.Invitado;

		$('#loadConfirmBtn').prop('disabled', false);
		$('#loadConfirmBtn').prop('value', 'Confirmar');
		console.log(response);
		
		$("#guestsAmount").text(" (" + response.Invitado.cantidadInvitados + ")");

		var i, n = response.Invitado.cantidadInvitados - response.Invitado.invitados.length;
		for (i = 0; i<n; i++) {
			addGuestInfo(i);
		}

		addGuest();

		for (i = 0, n = response.Invitado.invitados.length; i<n; i++) {
			addGuestData(response.Invitado.invitados[i], i);
		}

		if (response.Invitado.invitados.length > 0) {
			removeGuest();
		}
		/**
		 * TODO: Ver el response, si el user ya fue confirmado, cambiar boton a Cancelar
		 * Cambiar el string titulo y poner el text y cantidad de invitados en parentesis
		 * ver cantidad de invitados y ver los invitados del response, comparar cantidad, si el array tiene menos, agregar inputs
		 * el resto poner solo el string del nombre y un botón de cancelar
		 */
	})
	.fail(function (e) {
		console.error(e);
		alert('Error verificando el código, asegurese de que el código sea el asignado');
	});
};

$(document).ready(function () {

	window.addEventListener("resize", function() {
		this.setTimeout(function () {
			getFlipbookSize($(document).width(), $("#flipbook"));
		}, 500);
	});

	$("#flipbook").turn({
		autoCenter: true,
		gradients: true,
		display: 'double',
		acceleration: true,
		elevation: 50
	});

	getFlipbookSize($(document).width(), $("#flipbook"));

	$('#flipbook').bind('turned', function (e, page) {
		if (page === 2) {
			typingMethod();		
		} else {
			var typingElements = [document.getElementById('page1'), document.getElementById('page2')];
			if (typingElements[0] && typeof typingElements[0].innerHTML !== 'undefined') {
				typingElements[0].innerHTML = '';
			}
			if (typingElements[1] && typeof typingElements[1].innerHTML !== 'undefined') {
				typingElements[1].innerHTML = '';
			}

		}

		if (page === 8) {
			$('#loadConfirmBtn').click(function (e) {
				
				$('#loadConfirmBtn').prop('disabled', true);
		
				if (!userLoaded) {
					var code = $('#userCode').val();
					loadCode(code);
				}
		
			});
		}
	});

	$('#guestNameId').text(getGuestName(window.location.search));

	var urlGetByName = '/byName';
	var nameSplit = getGuestName(window.location.search).split(' ');
	nameSplit.map(function (name) {
		urlGetByName = urlGetByName + '/' + name;
	});

	if (urlGetByName.indexOf('undefined') === -1) {
		$.get(urlGetByName, function(data) {
			invitado = data.Invitado;
			if (invitado && typeof invitado.cantidadInvitados !== 'undefined') {
				$('#guestAmount').innerHTML = invitado.cantidadInvitados;
			}
		})
		.fail(function (e) {
			console.error(e);
			alert('Error cargando el usuario, revise su internet o contactese con el administrador');
		});
	}

	$('#loadConfirmBtn').click(function (e) {
		console.log('entro');
		$('#loadConfirmBtn').prop('disabled', true);

		if (!userLoaded) {
			var code = $('#userCode').val();
			console.log(code);
			if (code !== '') {
				$.post('/loadCode', {code: code}, function () {
					$('#loadConfirmBtn').prop('disabled', false);
					$('#loadConfirmBtn').prop('value', 'Confirmar');
				})
				.fail(function (e) {
					console.error(e);
					alert('Error verificando el código, asegurese de que el código sea el asignado');
				});
			}
		}

	});

});

typingMethod = function () {
	// set up text to print, each item in array is new line
	var aText = new Array(
		"Every once in a while, in the middle of an ordinary Life, Love gives us a Fairytale..."
	);
	var secondText = new Array (
		"Welcome to our Fairytale"
	);
	var iSpeed = 100; // time delay of print out

	var typewriter = function (id, array, callback)
	{
		var iIndex = 0; // start printing array at this posision
		var iArrLength = array[0].length; // the length of the text array
		var iScrollAt = 20; // start scrolling up at this many lines

		var iTextPos = 0; // initialise text position
		var sContents = ''; // initialise contents variable
		var iRow; // initialise current row
		
		var recursive;
		sContents =  ' ';
		
		recursive = function () {
			iRow = Math.max(0, iIndex-iScrollAt);
			var destination = document.getElementById(id);

			while ( iRow < iIndex ) {
				sContents += array[iRow++] + '<br />';
			}

			destination.innerHTML = sContents + array[iIndex].substring(0, iTextPos) + "_";

			if ( iTextPos++ === iArrLength ) {
				iTextPos = 0;
				iIndex++;
				if ( iIndex != array.length ) {
					iArrLength = array[iIndex].length;
					setTimeout(function() {
						recursive();
					}, 500);
				} else {
					if (typeof callback === 'function') {
						callback();
					}
				}
			} else {
				setTimeout(function() {
					recursive();
				}, iSpeed);
			}
		};

		recursive();
	}


	typewriter('page1', aText, function () {
		typewriter('page2', secondText);
	});
};