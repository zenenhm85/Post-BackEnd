/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Articulos = require('../models/articulos.model');

/*=============================================
FUNCIÓN GET
=============================================*/

let mostrarArticulos = (req, res)=>{

	Articulos.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		Articulos.countDocuments({}, (err, total)=>{

			if(err){

				return res.json({

					status:500,
					mensaje: "Error en la petición"

				})
			}

			res.json({
				status: 200,
				total,
				data
			})

		})

	}) 

}





/*=============================================
EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
=============================================*/

module.exports = {
	mostrarArticulos
}