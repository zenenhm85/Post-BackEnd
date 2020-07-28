const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Slide = require('../controllers/slides.controller');

/*=============================================
IMPORTAMOS EL MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');

/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/slide', Slide.mostrarSlide);

app.post('/slide', verificarToken, Slide.crearSlide);

app.put('/slide/:id', verificarToken, Slide.editarSlide);

app.delete('/slide/:id', verificarToken, Slide.borarSlide);


/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;
