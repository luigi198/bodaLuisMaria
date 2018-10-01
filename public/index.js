var typingMethod;
var ratio = 1.3;
var invitado = null;
var userLoaded = false;
var iSpeed = 100; // time delay of print out
var typewriter;
var typing = false;

var getFlipbookSize = function (windowWidth, windowHeight, flipbook) {
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

	if (height > windowHeight) {
		height = windowHeight - (windowHeight * 0.1);
		width = Math.floor(ratio * height);
	}

	flipbook.turn('size', width, height);
};

var removeGuestUnbind = function () {
	$('body').off('click', '.removeGuest');
};

var removeGuest = function () {
	$('body').on('click', '.removeGuest', function () {
		var elementId = $(this).attr('id');
		var guestNumber = elementId.split('guestDataNumber')[1];
		var obj = {
			code: invitado.code,
			guest: invitado.invitados[guestNumber]
		};

		$.post('/removeGuest', obj, function (response) {
			$('#guestDataContainer' + guestNumber).remove();
			if (invitado) {
				invitado.invitados.splice(guestNumber, 1);
				$('#guestsData').empty();
				$('#guestsInformation').empty();
				removeGuestUnbind();

				var i, n = invitado.cantidadInvitados - invitado.invitados.length;
				for (i = 0; i<n; i++) {
					addGuestInfo(i);
				}
	
				addGuest();
	
				for (i = 0, n = invitado.invitados.length; i<n; i++) {
					addGuestData(invitado.invitados[i], i);
				}
	
				if (invitado.invitados.length > 0) {
					removeGuest();
				}
			}
		})
		.fail(function (e) {
			console.error(e);
			alert('Error quitando invitado, porfavor refresque la página y trate de nuevo o contactese con los organizadores');
		});
	});
};

var addGuestUnbind = function () {
	$('body').off('click', '.addGuest');
};

var addGuest = function () {
	$('body').on('click', '.addGuest', function () {
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
				addGuestUnbind();
				removeGuestUnbind();
				addGuestData(guestObj, invitado.invitados.length - 1);
				addGuest();
				if (invitado.invitados.length > 0) {
					removeGuest();
				}
			})
			.fail(function (e) {
				console.error(e);
				alert('Error agregando invitado, porfavor refresque la página y trate de nuevo o contactese con los organizadores');
			});
		}

	});
};

var addGuestData = function (data, i) {
	$('#guestsInformation').append('<div id="guestDataContainer' + i + '" style="margin-bottom: 1rem;"><p class="mediumBigFont">Invitado:</p><p style="font-weight: bold;">' + data.firstName + ' ' + data.lastName + ' ' + data.secondLastName + '</p><button id="guestDataNumber' + i + '" type="button" class="btn btn-danger btn-font-resize removeGuest">Cancelar</button></div>')
};

var addGuestInfo = function (i) {
	$('#guestsData').append('<div id="guestContainer' + i + '" style="margin-bottom: 10px;"><p class="mediumBigFont">Invitado:</p><input id="guestName' + i + '" type="text" class="form-control guestData input-font-resize" placeholder="Nombre" /><div id="errorMsgFirstName' + i + '" class="alert alert-danger mediumBigFont" style="display: none;" role="alert">El Nombre es requerido!</div><input type="text" id="guestLastName' + i + '" class="form-control guestData input-font-resize" placeholder="Primer Apellido" /><div id="errorMsgLastName' + i + '" class="alert alert-danger" style="display: none;" role="alert">El Apellido es requerido!</div><input type="text" id="guestSecondLastName' + i + '" class="form-control guestData input-font-resize" placeholder="Segundo Apellido" /><button id="guestNumber' + i + '" type="button" class="btn btn-success btn-font-resize addGuest">Agregar</button></div>');
};

var loadCode = function (code) {
	$.post('/loadCode', {code: code}, function (response) {
		invitado = response.Invitado;

		$('#loadConfirmBtn').prop('disabled', false);
		$('#loadConfirmBtn').prop('value', 'Confirmar');

		$('#guestsData').empty();
		$('#guestsInformation').empty();

		var viewport = document.querySelector('meta[name="viewport"]');

		if ( viewport ) {
			viewport.content = 'initial-scale=1';
			viewport.content = 'width=device-width';
		}
		
		if (typing) {
			typing = false;
			setTimeout(function () {
				typing = true;
				typewriter('guestNameId', new Array(invitado.firstName + " " + invitado.lastName + " " + invitado.secondLastName));
			}, 200);
		} else {
			typing = true;
			typewriter('guestNameId', new Array(invitado.firstName + " " + invitado.lastName + " " + invitado.secondLastName));
		}
	})
	.fail(function (e) {
		console.error(e);
		$('#loadConfirmBtn').prop('disabled', false);
		alert('Error verificando el código, asegurese de que el código sea el asignado');
	});
};

$(document).ready(function () {

	window.addEventListener("resize", function() {
		this.setTimeout(function () {
			getFlipbookSize($(document).width(), $(document).height(), $("#flipbook"));
		}, 500);
	});

	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	if(!isChrome){
		$('#iframeAudio').remove()
	}
	else{
		$('#playAudio').remove() //just to make sure that it will not have 2x audio in the background 
	}

	$("#flipbook").turn({
		autoCenter: true,
		gradients: true,
		display: 'double',
		acceleration: true,
		elevation: 50
	});

	getFlipbookSize($(document).width(), $(document).height(), $("#flipbook"));

	$('#flipbook').bind('turned', function (e, page) {
		typing = false;

		if (page === 1) {
			$('#turnBtnLeft').addClass('disabled');
		} else {
			$('#turnBtnLeft').removeClass('disabled');
		}

		if (page >= $('#flipbook').turn('pages') - 1) {
			$('#turnBtnRight').addClass('disabled');
		} else {
			$('#turnBtnRight').removeClass('disabled');
		}

		if (page === 2 || page === 3) {
			$('#page1').text('');
			$('#page2').text('');
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

		if (page === 4 || page === 5) {
			$('body').off('click', '#loadConfirmBtn');
			$('body').on('click', '#loadConfirmBtn', function (e) {
				console.log('entro');
				$("#flipbook").turn("disable", false);
				
				$('#loadConfirmBtn').prop('disabled', true);
				
				if (!userLoaded) {
					var code = $('#userCode').val();
					loadCode(code);
				}
				
			});
			$("#flipbook").turn("disable", true);
		}

		if (page === 8 || page === 9) {
			if (invitado) {
				$("#guestAmount").text(" (" + invitado.cantidadInvitados + ")");
				$('#guestsData').empty();
				$('#guestsInformation').empty();
				removeGuestUnbind();

				var i, n = invitado.cantidadInvitados - invitado.invitados.length;
				for (i = 0; i<n; i++) {
					addGuestInfo(i);
				}
	
				addGuest();
	
				for (i = 0, n = invitado.invitados.length; i<n; i++) {
					addGuestData(invitado.invitados[i], i);
				}
	
				if (invitado.invitados.length > 0) {
					removeGuest();
				}
			}
		}
	});

	$('#turnBtnLeft').click(function () {
		if ($('#flipbook').turn('page') > 1) {
			$('#flipbook').turn('previous');
		}
	});

	$('#turnBtnRight').click(function () {
		if ($('#flipbook').turn('page') !== $('#flipbook').turn('pages')) {
			$('#flipbook').turn('next');
		}
	});

	$('body').zoom({
		flipbook: $("#flipbook"),
		max: 3,
		when: {
			swipeLeft: function () {
				$('#flipbook').turn('next');
			},
			swipeRight: function () {
				$('#flipbook').turn('previous');
			}
		}
	});

});

typewriter = function (id, array, callback)
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
		if (typing) {
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
					typing = false
					if (typeof callback === 'function') {
						callback();
					}
				}
			} else {
				setTimeout(function() {
					recursive();
				}, iSpeed);
			}
		}
	};

	recursive();
}

typingMethod = function () {
	// set up text to print, each item in array is new line
	var aText = new Array(
		"Every once in a while, in the middle of an ordinary Life, Love gives us a Fairytale..."
	);
	var secondText = new Array (
		"Welcome to our Fairytale"
	);

	typing = true;
	typewriter('page1', aText, function () {
		typing = true;
		typewriter('page2', secondText);
	});
};