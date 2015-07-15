// Importamos el modelo
var models = require('../models/models.js');

// Autoload - factoriza el codigo si en la ruta existe el parametro quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error('No existe quizId=' + quizId));
			}

		}).catch(function(error) {next(error);});
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
			res.render('quizes/index', {quizes: quizes});
		}).catch(function(error) {next(error);});
	}
	else
	{
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}).catch(function(error) {next(error);});
	}
};

// GET quizes/:quizId
exports.show = function(req, res){
	res.render('quizes/show',{quiz: req.quiz});	
};

// GET quizes/:quizId/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta)
		resultado = 'Correcto';

	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};