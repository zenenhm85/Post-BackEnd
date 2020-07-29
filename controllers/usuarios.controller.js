/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Usuarios = require('../models/usuarios.model');

//Requerimos el módulo para encriptar contraseñas
const bcrypt = require('bcrypt');

/*=============================================
FUNCIÓN GET
=============================================*/

let mostrarUsuarios = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Usuarios.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		Usuarios.countDocuments({}, (err, total)=>{

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

let crearUsuario = (req, res)=>{

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	//Obtenemos los datos del formulario para pasarlos al modelo

	let usuarios = new Usuarios({
	
		usuario:body.usuario,
		password:bcrypt.hashSync(body.password,10),
		email: body.email

	})

	//Guardamos en MongoDB
	//https://mongoosejs.com/docs/api.html#model_Model-save

	usuarios.save((err, data)=>{

		if(err){

			return res.json({

				status:400,
				mensaje: err.message,
				err

			})

		}

		res.json({

			status:200,
			data,
			mensaje:"El usuario ha sido creado con éxito"

		})

	})

}




/*=============================================
FUNCIÓN LOGIN
=============================================*/

let loginUsuario =(req, res)=>{

	//Obtenemos el cuerpo del formulario del formulario

	let body = req.body;

	//Recorremos la base de datos en búsqueda de coincidencia con el usuario

	Usuarios.findOne({usuario:body.usuario}, (err, data)=>{

		//Validamos que no ocurra error en el proceso

		if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
		}


		//Validamos que el Usuario exista

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

		res.json({

			status:200,
			mensaje: "ok"
		})

	})

}

/*=============================================
EXPORTAMOS LAS FUNCIONES DEL CONTROLADOR
=============================================*/


module.exports = {

	mostrarUsuarios,
	crearUsuario,
	loginUsuario

}