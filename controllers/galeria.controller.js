/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Galeria = require('../models/galeria.model');

/*=============================================
FUNCIÓN GET
=============================================*/

let mostrarGaleria = (req, res)=>{

	Galeria.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		Galeria.countDocuments({}, (err, total)=>{

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
EXPORTAMOS LAS FUNCIONES DEL CONTROLADOR
=============================================*/

module.exports = {
	mostrarGaleria	
}