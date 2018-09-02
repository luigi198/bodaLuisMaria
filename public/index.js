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

	return decodeURI(urlSplit[1]);
};

var createInputForGuests = function (amount) {

};

var loadCode = function (code) {
	$.post('/loadCode', {code: code}, function (response) {
		$('#loadConfirmBtn').prop('disabled', false);
		$('#loadConfirmBtn').prop('value', 'Confirmar');
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

	console.log($('#loadConfirmBtn'));

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