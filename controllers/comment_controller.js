var models = require('../models/models.js');

// Autoload de :id de comentario
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else {
			next(new Error("No existe el commentId -> " + commentId));
		}
	}).catch(function(error){
		next(error);
	});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	console.log('Estamos en el metodo new de Comments');
	res.render('comments/new', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	console.log('Estamos en el metodo create de Comments');
	var comment = models.Comment.build(
	{
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
	});

	var errors = comment.validate();
	if (errors){
		var i = 0; 
		var errores = new Array(); //se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) 
			errores[i++]={message: errors[prop]};	

		res.render('comments/new', {quiz: req.params.quizId, errors: errores});
	} else {
		comment
		.save ()
		.then (function(){res.redirect('/quizes/' + req.params.quizId);});
	}
}

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save({
		fields: ["publicado"]
	})
	.then(function(){
		res.redirect('/quizes/' + req.params.quizId);
	})
	.catch(function(error){
		next(error);
	});
};