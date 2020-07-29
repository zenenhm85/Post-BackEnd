/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Slide = require('../models/slides.model');

/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/

const fs = require('fs');
const path = require('path');

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
/*=============================================
FUNCIÓN POST
=============================================*/
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
FUNCIÓN PUT
=============================================*/
let editarSlide = (req, res) => {
	//Capturamos el id del slide a actualizar

	let id = req.params.id;

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	/*=============================================
	1. VALIDAMOS QUE EL SLIDE SI EXISTA
	=============================================*/

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Slide.findById(id, (err, data) => {

		//Validamos que no ocurra error en el proceso

		if (err) {

			return res.json({

				status: 500,
				mensaje: "Error en el servidor",
				err

			})
		}

		//Validamos que el Slide exista

		if (!data) {

			return res.json({

				status: 400,
				mensaje: "El slide no existe en la Base de datos"

			})

		}

		let rutaImagen = data.imagen;

		/*=============================================
		2. VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
		=============================================*/

		let validarCambioArchivo = (req, rutaImagen) => {

			return new Promise((resolve, reject) => {

				if (req.files) {

					// Capturamos el archivo

					let archivo = req.files.archivo;

					//Validamos la extensión del archivo

					if (archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png') {

						let respuesta = {

							res: res,
							mensaje: "la imagen debe ser formato JPG o PNG"
						}

						reject(respuesta);
					}

					//Validamos el tamaño del archivo

					if (archivo.size > 2000000) {

						let respuesta = {

							res: res,
							mensaje: "la imagen debe ser inferior a 2MB"
						}

						reject(respuesta);
					}

					//Cambiar nombre al archivo

					let nombre = Math.floor(Math.random() * 10000);

					//Capturar la extensión del archivo

					let extension = archivo.name.split('.').pop();

					//Movemos el archivo a la carpeta

					archivo.mv(`./archivos/slide/${nombre}.${extension}`, err => {

						if (err) {

							let respuesta = {

								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}

						//Borramos la antigua imagen

						if (fs.existsSync(`./archivos/slide/${rutaImagen}`)) {

							fs.unlinkSync(`./archivos/slide/${rutaImagen}`);

						}

						//Damos valor a la nueva imagen

						rutaImagen = `${nombre}.${extension}`;

						resolve(rutaImagen);

					})


				} else {

					resolve(rutaImagen);

				}

			})

		}

		/*=============================================
		3. ACTUALIZAMOS LOS REGISTROS
		=============================================*/

		let cambiarRegistrosBD = (id, body, rutaImagen) => {

			return new Promise((resolve, reject) => {

				let datosSlide = {

					imagen: rutaImagen,
					titulo: body.titulo,
					descripcion: body.descripcion

				}

				//Actualizamos en MongoDB
				//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
				Slide.findByIdAndUpdate(id, datosSlide, { new: true, runValidators: true }, (err, data) => {

					if (err) {

						let respuesta = {

							res: res,
							error: error
						}

						reject(respuesta);

					}

					let respuesta = {

						res: res,
						data: data
					}

					resolve(respuesta);

				})

			})

		}

		/*=============================================
		SINCRONIZAMOS LAS PROMESAS
		=============================================*/

		validarCambioArchivo(req, rutaImagen).then(rutaImagen => {

			cambiarRegistrosBD(id, body, rutaImagen).then(respuesta => {

				respuesta["res"].json({

					status: 200,
					data: respuesta["data"],
					mensaje: "El slide ha sido actualizado con éxito"

				})

			}).catch(respuesta => {

				respuesta["res"].json({

					status: 400,
					err: respuesta["err"],
					mensaje: "Error al editar el slide"

				})


			})

		}).catch(respuesta => {

			respuesta["res"].json({

				status: 400,
				mensaje: respuesta["mensaje"]

			})

		})

	})
}
/*=============================================
FUNCIÓN DELETE
=============================================*/
let borarSlide = (req, res) => {
	//Capturamos el id del slide a borrar

	let id = req.params.id;

	/*=============================================
	1. VALIDAMOS QUE EL SLIDE SI EXISTA
	=============================================*/

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Slide.findById(id, (err, data) => {

		//Validamos que no ocurra error en el proceso

		if (err) {

			return res.json({

				status: 500,
				mensaje: "Error en el servidor",
				err

			})
		}

		//Validamos que el Slide exista

		if (!data) {

			return res.json({

				status: 400,
				mensaje: "El slide no existe en la Base de datos"

			})

		}

		//Borramos la antigua imagen

		if (fs.existsSync(`./archivos/slide/${data.imagen}`)) {

			fs.unlinkSync(`./archivos/slide/${data.imagen}`);

		}

		// Borramos registro en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove

		Slide.findByIdAndRemove(id, (err, data) => {

			if (err) {

				return res.json({

					status: 500,
					mensaje: "Error al borrar el slide",
					err

				})
			}

			res.json({
				status: 200,
				mensaje: "El Slide ha sido borrado correctamente"

			})

		})

	})
}
/*=============================================
FUNCIÓN GET PARA TENER ACCESO A LAS IMÁGENES
=============================================*/

let mostrarImg = (req, res)=>{

	let imagen = req.params.nombre;
	let rutaImagen = `./archivos/slide/${imagen}`;

	fs.exists(rutaImagen, exists=>{

		if(!exists){

			return res.json({
				status:400,
				mensaje: "La imagen no existe"
			})

		}

		res.sendFile(path.resolve(rutaImagen));

	})

}

/*=============================================
EXPORTAMOS LAS FUNCIONES DEL CONTROLADOR
=============================================*/

module.exports = {
	mostrarSlide,
	crearSlide,
	editarSlide,
	borarSlide,
	mostrarImg
}