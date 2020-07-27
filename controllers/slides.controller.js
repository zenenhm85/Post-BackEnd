/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Slide = require('../models/slides.model');

/*=============================================
FUNCIÓN GET
=============================================*/

let mostrarSlide = (req, res) => {

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Slide.find({})
		.exec((err, data) => {

			if (err) {

				return res.json({

					status: 500,
					mensaje: "Error en la petición"

				})
			}

			//Contar la cantidad de registros
			Slide.countDocuments({}, (err, total) => {

				if (err) {

					return res.json({

						status: 500,
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
let crearSlide = (req, res) => {

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	//Preguntamos si viene un archivo

	if (!req.files) {

		return res.json({

			status: 500,
			mensaje: "La imagen no puede ir vacía"

		})
	}

	// Capturamos el archivo

	let archivo = req.files.archivo;

	//Validamos la extensión del archivo

	if (archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png') {

		return res.json({

			status: 400,
			mensaje: "la imagen debe ser formato JPG o PNG"

		})
	}

	//Validamos el tamaño del archivo

	if (archivo.size > 2000000) {

		return res.json({

			status: 400,
			mensaje: "la imagen debe ser inferior a 2MB"

		})
	}

	//Cambiar nombre al archivo

	let nombre = Math.floor(Math.random() * 10000);

	//Capturar la extensión del archivo

	let extension = archivo.name.split('.').pop();

	//Movemos el archivo a la carpeta

	archivo.mv(`./archivos/slide/${nombre}.${extension}`, err => {

		if (err) {

			return res.json({

				status: 500,
				mensaje: "Error al guardar la imagen",
				err

			})

		}

		//Obtenemos los datos del formulario para pasarlos al modelo

		let slide = new Slide({

			imagen: `${nombre}.${extension}`,
			titulo: body.titulo,
			descripcion: body.descripcion

		})

		//Guardamos en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model-save

		slide.save((err, data) => {

			if (err) {

				return res.json({

					status: 400,
					mensaje: "Error al almacenar el slide",
					err

				})

			}

			res.json({

				status: 200,
				data,
				mensaje: "El slide ha sido creado con éxito"

			})

		})

	})

}
/*=============================================
EXPORTAMOS LAS FUNCIONES DEL CONTROLADOR
=============================================*/

module.exports = {
	mostrarSlide,
	crearSlide
}