const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Slide = require('../controllers/slides.controller');

/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/slides', Slide.mostrarSlide);


/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;
