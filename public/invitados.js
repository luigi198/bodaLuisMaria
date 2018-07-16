$(document).ready(function () {

	$("#getList").submit(function(e){
        e.preventDefault();

        $('#submitBtn').prop('disabled', true);

        var body = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val(),
            honeypot: $('#thisShouldBeEmptyId').val()
        };
        console.log(body);

        $.post('/lista', body, function() {
            $('#submitBtn').prop('disabled', false);
            alert('Lista enviada satisfactoriamente');
        })
        .fail(function (e) {
            $('#submitBtn').prop('disabled', false);
            alert('Error, por favor comunicarse con el administrador: ', e);
            console.error(e);
        });
    });

});