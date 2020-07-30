/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

//Requerimos el módulo para validaciones únicas
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuariosSchema = new Schema({

	usuario: {
		type: String,
		required: [true, "El usuario es obligatorio"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"]
	},
	email: {
		type: String,
		required: [true, "El email es obligatorio"],
		unique: true
	}
})


/*=============================================
Evitar devolver en la DATA el campo Password
=============================================*/

usuariosSchema.methods.toJSON = function(){

	let usuario = this;
	let usuarioObject = usuario.toObject();
	delete usuarioObject.password;

	return usuarioObject;

}

/*=============================================
Devolver mensaje personalizado para validaciones únicas
=============================================*/

usuariosSchema.plugin(uniqueValidator, {message: 'El {PATH} ya está registrado en la Base de datos' })


/*=============================================
EXPORTAMOS EL MODELO
=============================================*/

module.exports = mongoose.model("usuarios", usuariosSchema);