var express = require('express');
var router = express.Router();

// Importamos el controlador de quiz
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Definimos las rutas
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

module.exports = router;
