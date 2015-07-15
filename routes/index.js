var express = require('express');
var router = express.Router();

// Importamos el controlador de quiz
var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors:[] });
});

// Interceptamos el parametro quizId para el autoload
router.param('quizId', quizController.load);

// Definimos las rutas
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);

router.get('/author', authorController.index);

module.exports = router;
