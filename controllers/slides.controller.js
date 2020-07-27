/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Slide = require('../models/slides.model');

/*=============================================
FUNCIÓN GET
=============================================*/

let mostrarSlide = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Slide.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		Slide.countDocuments({}, (err, total)=>{

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
	mostrarSlide
}