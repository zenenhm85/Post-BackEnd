/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Admin = require('../models/admin.model');

//Requerimos el módulo para encriptar contraseñas
const bcrypt = require('bcrypt');

//Requerimos el módulo para generar token de autorización
const jwt = require('jsonwebtoken');

/*=============================================
FUNCIÓN GET
=============================================*/

let mostrarAdmin = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Admin.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		Admin.countDocuments({}, (err, total)=>{

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

let crearAdmin = (req, res)=>{

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	//Obtenemos los datos del formulario para pasarlos al modelo

	let admin = new Admin({
	
		usuario:body.usuario,
		password:bcrypt.hashSync(body.password,10)

	})

	//Guardamos en MongoDB
	//https://mongoosejs.com/docs/api.html#model_Model-save

	admin.save((err, data)=>{

		if(err){

			return res.json({

				status:400,
				mensaje: "Error al almacenar el administrador",
				err

			})

		}

		res.json({

			status:200,
			data,
			mensaje:"El administrador ha sido creado con éxito"

		})

	})

}

/*=============================================
FUNCIÓN PUT
=============================================*/

let editarAdmin = (req, res)=>{

	//Capturamos el id del administrador a actualizar

	let id = req.params.id;

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	/*=============================================
	1. VALIDAMOS QUE EL ADMINISTRADOR SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Admin.findById(id, ( err, data) =>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}

		//Validamos que el Administrador exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El administrador no existe en la Base de datos"
				
			})	

		}

		let pass = data.password;

		/*=============================================
		2. VALIDAMOS QUE HAYA CAMBIO DE CONTRASEÑA 
		=============================================*/

		let validarCambioPassword = (body, pass)=>{

			return new Promise((resolve, reject)=>{
			
				if(body.password == undefined){	

					resolve(pass);

				}else{

					pass = bcrypt.hashSync(body.password,10);

					resolve(pass);

				}

			})

		}

		/*=============================================
		3. ACTUALIZAMOS LOS REGISTROS
		=============================================*/

		let cambiarRegistrosBD = (id, body, pass)=>{

			return new Promise((resolve, reject)=>{

				let datosAdministrador = {

					usuario: body.usuario,
					password: pass
				
				}

				//Actualizamos en MongoDB
				//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
				Admin.findByIdAndUpdate(id, datosAdministrador, {new:true, runValidators:true}, ( err, data) =>{

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

		validarCambioPassword(body, pass).then(pass => {

			cambiarRegistrosBD(id, body, pass).then(respuesta =>{

				respuesta["res"].json({

					status:200,
					data: respuesta["data"],
					mensaje:"El administrador ha sido actualizado con éxito"

				})

			}).catch( respuesta => {

				respuesta["res"].json({

					status:400,
					err: respuesta["err"],
					mensaje:"Error al editar el administrador"

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

let borrarAdmin = (req, res)=>{

	//Capturamos el id del administrador a borrar

	let id = req.params.id;

	/*=============================================
	1. VALIDAMOS QUE EL ADMINISTRADOR SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById

	Admin.findById(id, ( err, data) =>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}

		//Validamos que el Administrador exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El administrador no existe en la Base de datos"
				
			})	

		}

		// Borramos registro en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove

		Admin.findByIdAndRemove(id, (err, data) =>{

			if(err){

				return res.json({

					status: 500,
					mensaje:"Error al borrar el administrador",
					err
				
				})
			}

			res.json({
				status:200,
				mensaje: "El administrador ha sido borrado correctamente"

			})
		
		})

	})

}

/*=============================================
FUNCIÓN LOGIN
=============================================*/

let login =(req, res)=>{

	//Obtenemos el cuerpo del formulario del formulario

	let body = req.body;

	//Recorremos la base de datos en búsqueda de coincidencia con el usuario

	Admin.findOne({usuario:body.usuario}, (err, data)=>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}


		//Validamos que el Administrador exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El usuario es incorrecto"
				
			})	

		}

		//Validamos que la contraseña sea correcta

		if( !bcrypt.compareSync(body.password, data.password)){

			return res.json({

				status: 400,
				mensaje:"La contraseña es incorrecta"
				
			})	

		}

		//Generamos el token de autorizacíón

		let token  = jwt.sign({

			data

		}, process.env.SECRET, { expiresIn: process.env.CADUCIDAD })

		res.json({

			status:200,
			token
		})

	})

}

/*=============================================
EXPORTAMOS LAS FUNCIONES DEL CONTROLADOR
=============================================*/


module.exports = {

	mostrarAdmin,
	crearAdmin,
	editarAdmin,
	borrarAdmin,
	login

}