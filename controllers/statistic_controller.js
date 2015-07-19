// Importamos el modelo
var models = require('../models/models.js');

var statistics = {
      quizes: 0,
      comments: 0,
      commentedQuizes:0
   };
var errors = [];

// GET /quizes/statistics
exports.statistics = function(req, res, next) {

	 models.Quiz.count()
  	.then(function (numQuizes) { // número de preguntas
	   statistics.quizes = numQuizes;
	   return models.Comment.count();
	  })
	  .then(function (numComments) { // número de comentarios sin publicar
	   statistics.comments = numComments;
	    return models.Comment.countCommentedQuizes();
	 })
	  .then(function (numCommented) { // número de preguntas con comentario
	   statistics.commentedQuizes = numCommented;
	  })
	  .catch(function (err) { errors.push(err); })
	  .finally(function () {
	    next();
	  });
};

// GET quizes/:quizId
exports.show = function(req, res){
	res.render('quizes/statistics',{statistics: statistics, errors:[]});	
};