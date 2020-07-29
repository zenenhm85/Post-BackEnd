/*=============================================
REQUERIMIENTOS
=============================================*/
require('./config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

/*=============================================
VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
=============================================*/

const app = express();

/*=============================================
MIDDLEWARE PARA BODY PARSER
=============================================*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));

// parse application/json
app.use(bodyParser.json({limit: '10mb', extended: true}));

/*=============================================
MIDDLEWARE PARA FILEUPLOAD
=============================================*/

// default options express-fileupload
app.use(fileUpload());

/*=============================================
EJECUTANDO CORS
=============================================*/

app.use(cors());

/*=============================================
MONGOOSE DEPRECATIONS
=============================================*/
// https://mongoosejs.com/docs/deprecations.html
const optionsMongoose={
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true
}

/*=============================================
RUTAS
=============================================*/
app.use( require('./routes/articulos.route'));
app.use( require('./routes/galeria.route'));
app.use( require('./routes/slides.route'));
app.use( require('./routes/admin.route'));
app.use( require('./routes/usuarios.route'));

/*=============================================
CONEXIÓN A LA BASE DE DATOS
=============================================*/

mongoose.connect('mongodb://localhost:27017/apirest-post', optionsMongoose, (err, res)=>{

	if(err) throw err;

	console.log("Conected to Data Base")

});

/*=============================================
SALIDA PUERTO HTTP
=============================================*/
app.listen(process.env.PORT, ()=>{
	console.log(`Enabled to port: ${process.env.PORT}`)
})

