// Definimos el modelo de la tabla Comments
module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Comment',
		{
			texto: {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Comentario"}}
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
 		{
   classMethods: {
    countCommentedQuizes: function () {
       return this.query("SELECT distinct('QuizId') FROM 'Comments'");
      }
    }
  });
};