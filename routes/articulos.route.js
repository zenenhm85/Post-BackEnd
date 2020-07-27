const express = require('express');
const app = express();

/*=============================================
IMPORTANDO EL CONTROLADOR
=============================================*/

const Articulos = require('../controllers/articulos.controller');

/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/articulos', Articulos.mostrarArticulos);


/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;