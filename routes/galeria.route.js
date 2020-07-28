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

app.post('/galeria', Galeria.crearGaleria);

app.put('/galeria/:id', Galeria.editarGaleria);

app.delete('/galeria/:id',Galeria.borrarGaleria);

/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;
