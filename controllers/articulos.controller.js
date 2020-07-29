/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Articulos = require('../models/articulos.model');

/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

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
FUNCIÓN POST
=============================================*/

let crearArticulo = (req, res)=>{

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

	//Creamos la nueva carpeta con el nombre de la URL

	let crearCarpeta = mkdirp.sync(`./archivos/articulos/${body.url}`);

	//Movemos el archivo a la carpeta

	archivo.mv(`./archivos/articulos/${body.url}/${nombre}.${extension}`, err => {

		if(err){

			return res.json({

				status:500,
				mensaje: "Error al guardar la imagen",
				err
				
			})

		}

		//Obtenemos los datos del formulario para pasarlos al modelo

		let articulos = new Articulos({
		
			portada:`${nombre}.${extension}`,
			titulo:body.titulo,
			intro:body.intro,
			url:body.url,
			contenido:body.contenido

		})

		//Guardamos en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model-save

		articulos.save((err, data)=>{

			if(err){

				return res.json({

					status:400,
					mensaje: "Error al almacenar el artículo",
					err

				})

			}

			res.json({

				status:200,
				data,
				mensaje:"El Artículo ha sido creado con éxito"

			})

		})

	})
	
}

/*=============================================
FUNCIÓN PUT
=============================================*/

let editarArticulo = (req, res)=>{

	//Capturamos el id del Articulos a actualizar

	let id = req.params.id;

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	/*=============================================
	1. VALIDAMOS QUE EL Articulos SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Articulos.findById(id, ( err, data) =>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}

		//Validamos que el Articulos exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El Artículo no existe en la Base de datos"
				
			})	

		}

		let rutaImagen = data.portada;

		/*=============================================
		2. VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
		=============================================*/

		let validarCambioArchivo = (req, body, rutaImagen)=>{

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

					archivo.mv(`./archivos/articulos/${body.url}/${nombre}.${extension}`, err =>{

						if(err){

							let respuesta = {

								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}

						//Borramos la antigua imagen

						if(fs.existsSync(`./archivos/articulos/${body.url}/${rutaImagen}`)){

							fs.unlinkSync(`./archivos/articulos/${body.url}/${rutaImagen}`);

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

		let cambiarRegistrosBD = (id, body, rutaImagen)=>{

			return new Promise((resolve, reject)=>{

				let datosArticulos = {

					portada: rutaImagen,
					titulo: body.titulo,
					intro: body.intro,
					url: body.url,
					contenido: body.contenido
				
				}

				//Actualizamos en MongoDB
				//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
				Articulos.findByIdAndUpdate(id, datosArticulos, {new:true, runValidators:true}, ( err, data) =>{

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

		validarCambioArchivo(req, body, rutaImagen).then(rutaImagen => {

			cambiarRegistrosBD(id, body, rutaImagen).then(respuesta =>{

				respuesta["res"].json({

					status:200,
					data: respuesta["data"],
					mensaje:"El artículo ha sido actualizado con éxito"

				})

			}).catch( respuesta => {

				respuesta["res"].json({

					status:400,
					err: respuesta["err"],
					mensaje:"Error al editar el Artículo"

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

let borrarArticulo = (req, res)=>{

	//Capturamos el id del Articulos a borrar

	let id = req.params.id;

	/*=============================================
	1. VALIDAMOS QUE EL Articulos SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Articulos.findById(id, ( err, data) =>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}

		//Validamos que el Articulos exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El artículo no existe en la Base de datos"
				
			})	

		}

		//Borramos la carpeta del artículo

		let rutaCarpeta = `./archivos/articulos/${data.url}`;
		rimraf.sync(rutaCarpeta);

		// Borramos registro en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove

		Articulos.findByIdAndRemove(id, (err, data) =>{

			if(err){

				return res.json({

					status: 500,
					mensaje:"Error al borrar el artículo",
					err
				
				})
			}

			res.json({
				status:200,
				mensaje: "El artículo ha sido borrado correctamente"

			})
		
		})

	})

}
/*=============================================
FUNCIÓN GET PARA TENER ACCESO A LAS IMÁGENES
=============================================*/

let mostrarImg = (req, res)=>{

	let ruta = req.params.ruta;
	let imagen = req.params.nombre;
	let rutaImagen = `./archivos/articulos/${ruta}/${imagen}`;

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

	mostrarArticulos,
	crearArticulo,
	editarArticulo,
	borrarArticulo,
	mostrarImg
}