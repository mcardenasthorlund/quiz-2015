// MW para controlar la expiracion de la sesion
exports.autoLogout = function(req, res, next)
{
	// Comprobamos el tiempo de autologout
    if (req.session.user)
    {
        var tmpLastTransaction = (req.session.user.transactionTime) || 0;
        var fecha = new Date();

        // Comprobamos que no hayan pasado mas de 2 minutos desde la ultima transaccion
        if (Number(fecha.getTime()) - Number(tmpLastTransaction) > 120000 && Number(tmpLastTransaction) > 0)
        {
        	// Eliminamos la sesion y continuamos
            delete req.session.user;
            next();
        }
        else {
        	// Guardamos el nuevo tiempo
        	req.session.user.transactionTime = fecha.getTime();
        	next();
        }
    }
    else
    	next();
}

// MW de autorizacion de accesos a primitivas restringidas por usuario
exports.loginRequired = function(req, res, next)
{
	if (req.session.user)
		next();
	else
		res.redirect('/login');
}

// GET /login
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error,user){
		if (error) {
			req.session.errors = [{"message": "Se ha producido un error: " + error}];
			res.redirect("/login");
			return;
		}

		// Creamos la sesion del usuario
		req.session.user = {id: user.id, username: user. username};
		res.redirect(req.session.redir.toString()); // Redireccion a la ruta solicitada
	});
};

// DELETE /logout
exports.destroy = function (req,res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString());
};