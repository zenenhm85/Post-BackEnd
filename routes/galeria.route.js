const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Galeria = require('../controllers/galeria.controller');

/*=============================================
IMPORTAMOS EL MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');


/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/galeria', Galeria.mostrarGaleria);
app.get('/galeria/img/:nombre', Galeria.mostrarImg);

app.post('/galeria', verificarToken, Galeria.crearGaleria);

app.put('/galeria/:id', verificarToken, Galeria.editarGaleria);

app.delete('/galeria/:id',verificarToken, Galeria.borrarGaleria);

/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;
