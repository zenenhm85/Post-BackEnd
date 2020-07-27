const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Galeria = require('../controllers/galeria.controller');


/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/galeria', Galeria.mostrarGaleria);

/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;
