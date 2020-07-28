const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Articulos = require('../controllers/articulos.controller');


/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/articulos', Articulos.mostrarArticulos);

app.post('/articulo', Articulos.crearArticulo);

app.put('/articulo/:id', Articulos.editarArticulo);

app.delete('/articulo/:id', Articulos.borrarArticulo);

/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;

