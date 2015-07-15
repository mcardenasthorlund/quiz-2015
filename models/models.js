var path = require('path');

// Cargamos el modelo ORM
var Sequelize = require('sequelize');

// Inicializamos el objeto para sqlite
var sequelize = new Sequelize(null, null, null,
	{dialect: "sqlite", storage: "quiz.sqlite"}
	);

// Importamos la definicion de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Exportamos la definicion de la tabla
exports.Quiz = Quiz;

// Sincronizamos con la base de datos
sequelize.sync().success(function() {
	Quiz.count().success(function (count){
		if (count === 0) {
			Quiz.create({pregunta: 'Capital de Italia',
				respuesta: 'Roma'})
			.success(function(){console.log('Base de datos incializada')});
		};
	});
});