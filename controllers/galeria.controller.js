/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Galeria = require('../models/galeria.model');

/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/

const fs = require('fs');
const path = require('path');

/*=============================================
FUNCIÓN GET
=============================================*/

let mostrarGaleria = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

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
FUNCIÓN POST
=============================================*/

let crearGaleria = (req, res)=>{

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	//Preguntamos si viene un archivo

	if(!req.files){
		
		return res.json({

			status:500,
			mensaje: "La imagen no puede ir vacía"
			
		})

	}

	// Capturamos el archivo

	let archivo = req.files.archivo;
	
	//Validamos la extensión del archivo

	if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){

		return res.json({

			status:400,
			mensaje: "la imagen debe ser formato JPG o PNG"
			
		})
	}

	//Validamos el tamaño del archivo

	if(archivo.size > 2000000){

		return res.json({

			status:400,
			mensaje: "la imagen debe ser inferior a 2MB"
			
		})
	}

	//Cambiar nombre al archivo

	let nombre = Math.floor(Math.random()*10000);

	//Capturar la extensión del archivo

	let extension = archivo.name.split('.').pop();

	//Movemos el archivo a la carpeta

	archivo.mv(`./archivos/galeria/${nombre}.${extension}`, err => {

		if(err){

			return res.json({

				status:500,
				mensaje: "Error al guardar la imagen",
				err
				
			})

		}

		//Obtenemos los datos del formulario para pasarlos al modelo

		let galeria = new Galeria({
		
			foto:`${nombre}.${extension}`

		})

		//Guardamos en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model-save

		galeria.save((err, data)=>{

			if(err){

				return res.json({

					status:400,
					mensaje: "Error al almacenar la foto de la galería",
					err

				})

			}

			res.json({

				status:200,
				data,
				mensaje:"La foto de la galería ha sido creada con éxito"

			})

		})

	})
	
}

/*=============================================
FUNCIÓN PUT
=============================================*/

let editarGaleria = (req, res)=>{

	//Capturamos el id del Galeria a actualizar

	let id = req.params.id;

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	/*=============================================
	1. VALIDAMOS QUE LA Galeria SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Galeria.findById(id, ( err, data) =>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}

		//Validamos que la foto de la Galeria exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"La foto de la galería no existe en la Base de datos"
				
			})	

		}

		let rutaImagen = data.foto;

		/*=============================================
		2. VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
		=============================================*/

		let validarCambioArchivo = (req, rutaImagen)=>{

			return new Promise((resolve, reject)=>{

				if(req.files){

					// Capturamos el archivo

					let archivo = req.files.archivo;
					
					//Validamos la extensión del archivo

					if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){

						let respuesta = {

							res: res,
							mensaje: "la imagen debe ser formato JPG o PNG"
						}

						reject(respuesta);
					}

					//Validamos el tamaño del archivo

					if(archivo.size > 2000000){

						let respuesta = {

							res: res,
							mensaje: "la imagen debe ser inferior a 2MB"
						}

						reject(respuesta);
					}

					//Cambiar nombre al archivo

					let nombre = Math.floor(Math.random()*10000);

					//Capturar la extensión del archivo

					let extension = archivo.name.split('.').pop();

					//Movemos el archivo a la carpeta

					archivo.mv(`./archivos/galeria/${nombre}.${extension}`, err =>{

						if(err){

							let respuesta = {

								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}

						//Borramos la antigua imagen

						if(fs.existsSync(`./archivos/galeria/${rutaImagen}`)){

							fs.unlinkSync(`./archivos/galeria/${rutaImagen}`);

						}

						//Damos valor a la nueva imagen

						rutaImagen = `${nombre}.${extension}`;

						resolve(rutaImagen);

					})


				}else{

					resolve(rutaImagen);

				}

			})

		}

		/*=============================================
		3. ACTUALIZAMOS LOS REGISTROS
		=============================================*/

		let cambiarRegistrosBD = (id, rutaImagen)=>{

			return new Promise((resolve, reject)=>{

				let datosGaleria = {

					foto: rutaImagen
				
				}

				//Actualizamos en MongoDB
				//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
				Galeria.findByIdAndUpdate(id, datosGaleria, {new:true, runValidators:true}, ( err, data) =>{

					if(err){

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

			cambiarRegistrosBD(id, rutaImagen).then(respuesta =>{

				respuesta["res"].json({

					status:200,
					data: respuesta["data"],
					mensaje:"La foto de la galería ha sido actualizada con éxito"

				})

			}).catch( respuesta => {

				respuesta["res"].json({

					status:400,
					err: respuesta["err"],
					mensaje:"Error al editar la Galería"

				})


			})

		}).catch(respuesta => {

			respuesta["res"].json({

				status:400,
				mensaje:respuesta["mensaje"]

			})

		})

	})
	
}


/*=============================================
FUNCIÓN DELETE
=============================================*/

let borrarGaleria = (req, res)=>{

	//Capturamos el id del Galeria a borrar

	let id = req.params.id;

	/*=============================================
	1. VALIDAMOS QUE EL Galeria SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Galeria.findById(id, ( err, data) =>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}

		//Validamos que el Galeria exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"La foto de la galería no existe en la Base de datos"
				
			})	

		}

		//Borramos la antigua imagen

		if(fs.existsSync(`./archivos/galeria/${data.foto}`)){

			fs.unlinkSync(`./archivos/galeria/${data.foto}`);

		}

		// Borramos registro en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove

		Galeria.findByIdAndRemove(id, (err, data) =>{

			if(err){

				return res.json({

					status: 500,
					mensaje:"Error al borrar la foto de la galería",
					err
				
				})
			}

			res.json({
				status:200,
				mensaje: "La foto de la galería ha sido borrada correctamente"

			})
		
		})

	})

}
/*=============================================
FUNCIÓN GET PARA TENER ACCESO A LAS IMÁGENES
=============================================*/

let mostrarImg = (req, res)=>{

	let imagen = req.params.nombre;
	let rutaImagen = `./archivos/galeria/${imagen}`;

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

	mostrarGaleria,
	crearGaleria,
	editarGaleria,
	borrarGaleria,
	mostrarImg
}