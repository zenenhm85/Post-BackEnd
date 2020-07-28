const jwt = require('jsonwebtoken');

/*=============================================
Verificar token
=============================================*/

let verificarToken = (req, res, next)=>{

	let token = req.get('Authorization');

	jwt.verify(token, process.env.SECRET, (err, decoded)=>{

		if(err){

			return res.json({

				status:401,
				mensaje: "El token de autorización no es válido"
			})

		}

		req.usuario = decoded.usuario;

		next();

	})

}

module.exports = {
	verificarToken
}
