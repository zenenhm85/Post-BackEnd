/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articulosSchema = new Schema({

	portada: {
		type: String,
		required: [true, "La portada es obligatoria"]
	},
	titulo: {
		type: String,
		required: [true, "El título es obligatorio"]
	},
	intro: {
		type: String,
		required: [true, "La introducción es obligatoria"]
	},
	url: {
		type: String,
		required: [true, "La url es obligatoria"]
	},
	contenido: {
		type: String,
		required: [true, "El contenido es obligatorio"]
	}
})

/*=============================================
EXPORTANDO EL MODELO
=============================================*/

module.exports = mongoose.model("articulos", articulosSchema);