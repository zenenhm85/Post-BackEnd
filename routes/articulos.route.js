const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Articulos = require('../controllers/articulos.controller');

/*=============================================
IMPORTAMOS EL MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');


/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/articulos', Articulos.mostrarArticulos);

app.post('/articulo', verificarToken, Articulos.crearArticulo);

app.put('/articulo/:id', verificarToken, Articulos.editarArticulo);

app.delete('/articulo/:id', verificarToken, Articulos.borrarArticulo);

/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;

