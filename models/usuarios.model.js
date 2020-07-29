/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

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
EXPORTAMOS EL MODELO
=============================================*/

module.exports = mongoose.model("usuarios", usuariosSchema);