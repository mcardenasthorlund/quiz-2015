// Importamos el modelo
var models = require('../models/models.js');


// Autoload - factoriza el codigo si en la ruta existe el parametro quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: {id: Number(quizId) },
		include: [{ model: models.Comment}]
	}).then(
		function(quiz) {
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error('No existe quizId=' + quizId));
			}

		}).catch(function(error) {next(error);}
		);
};

// GET quizes
exports.index = function(req, res, next){
	if (req.query.search)
	{
		// Formateamos la cadena
		var cadena = req.query.search.replace(' ','%');
		cadena = '%' + cadena + '%';

		// Buscamos en la base de datos
		models.Quiz.findAll({where: ["pregunta like ?", cadena], order: ['pregunta']}).then(function (quizes){
			res.render('quizes/index', {quizes: quizes, errors:[]});
		}).catch(function(error) {next(error);});
	}
	else
	{
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors:[]});
		}).catch(function(error) {next(error);});
	}
};

// GET quizes/:quizId
exports.show = function(req, res){
	res.render('quizes/show',{quiz: req.quiz, errors:[]});	
};

// GET quizes/:quizId/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta)
		resultado = 'Correcto';

	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[]});
};

// GET quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", tematica: "otro"}
	);
	res.render('quizes/new', {quiz: quiz, errors:[]});
};

// POST /quizes/create
exports.create = function (req, res, next) {
	var quiz = models.Quiz.build(req.body.quiz);

	var errors = quiz.validate();
	if (errors)
	{
		var i = 0; 
		var errores = new Array(); //se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) 
			errores[i++]={message: errors[prop]};	
		
		res.render('quizes/new', {quiz: quiz, errors: errores});
		} else {
			quiz
				.save({fields: ["pregunta", "respuesta", "tematica"]})
				.then(function(){
					// Redireccion a la accion index para listar las preguntas
					res.redirect('/quizes')
				}).catch(function(error) {next(error);});
		}
};

// GET /quizes/:quidId/edit
exports.edit = function (req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors:[]});
}

// PUT /quizes/:quizId
exports.update = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	req.quiz.pregunta = quiz.pregunta;
	req.quiz.respuesta = quiz.respuesta;
	req.quiz.tematica = quiz.tematica;

	var errors = req.quiz.validate();
	if (errors){
		var i = 0; 
		var errores = new Array(); //se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) 
			errores[i++]={message: errors[prop]};	

		res.render('quizes/edit', {quiz: req.quiz, errors: errores});
	} else {
		req.quiz
		.save ({fields: ["pregunta", "respuesta", "tematica"]})
		.then (function(){res.redirect('/quizes');});
	}
};

// DELETE /quizes/:quizId
exports.destroy = function(req, res, next) {
	req.quiz
	.destroy()
	.then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
}

