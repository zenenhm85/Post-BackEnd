const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Admin = require('../controllers/admin.controller');

/*=============================================
IMPORTAMOS EL MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');

/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.get('/admins',verificarToken, Admin.mostrarAdmin);

app.post('/admin', verificarToken, Admin.crearAdmin);
app.post('/login', Admin.login);

app.put('/admin/:id', verificarToken, Admin.editarAdmin);

app.delete('/admin/:id', verificarToken, Admin.borrarAdmin);

/*=============================================
EXPORTAMOS LA RUTA
=============================================*/

module.exports = app;
