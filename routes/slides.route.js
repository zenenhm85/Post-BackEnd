const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Slide = require('../controllers/slides.controller');

/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/slide', Slide.mostrarSlide);

app.post('/slide', Slide.crearSlide);

app.put('/slide/:id', Slide.editarSlide);

app.delete('/slide/:id', Slide.borarSlide);


/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;
