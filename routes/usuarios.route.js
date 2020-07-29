const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Usuarios = require('../controllers/usuarios.controller');

/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/usuarios',  Usuarios.mostrarUsuarios);

app.post('/usuario',  Usuarios.crearUsuario);

app.post('/usuario/login', Usuarios.loginUsuario);

/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;