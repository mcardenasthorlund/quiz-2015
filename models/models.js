var path = require('path');

// Obtenemos el URL de la base de datos y separamos los valores
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// Sqlite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_NAME = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargamos el modelo ORM
var Sequelize = require('sequelize');

// Inicializamos el objeto para sqlite o Postgres dependiendo de la configuracion
var sequelize = new Sequelize(DB_NAME, user, pwd,
	{
		dialect: dialect, 
		protocol: protocol,
		port: port,
		host: host,
		storage: storage,
		omitNull: true
	}
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