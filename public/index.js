var typingMethod;
var ratio = 1.3;
var invitado = null;

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

			if (page === 6) {
				
			}
		}
	});

	$('#guestNameId').text(getGuestName(window.location.search));

	var urlGetByName = '/byName';
	var nameSplit = getGuestName(window.location.search).split(' ');
	nameSplit.map(function (name) {
		urlGetByName = urlGetByName + '/' + name;
	});

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