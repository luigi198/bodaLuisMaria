## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

## .env structure
MONGODB_URI
NODE_ENV
SECRET_JWT
SENDINBLUE_API_KEY

## TODO
Agregar usuarios
Login

## Sobre invitados y funcionalidad de BE
Los Urls contienen el nombre del invitado, es importante que este bien:
http://localhost:5000/?name=Mar%C3%ADa%20Fernanda%20Drexler
Ese url va a cargar el nombre: María Fernanda Drexler

A cada invitado se le va a asignar un código, más adelante en el sistema, va a haber una sección para ingresar el código.
Una vez que se ingresa el código, se carga la información del contacto... Un botón de confirmar, si ya fue confirmado, uno de desconfirmar
En la otra página del libro, se cargan los inputs para ingresar invitados, si tiene 3 invitados entonces carga 3 entradas de texto.
Si el usuario ya confirmo alguno, en vez del input, cargar el nombre del invitado y en vez de guardar, eliminar. Si se elimina un invitado,
quitar el texto y habilitar de nuevo la entrada de texto para guardar un nuevo invitado.