// GET author
exports.author = function(req, res){
	res.render('author/author',
		{nombre: 'Manuel Cárdenas Thorlund',
		fotografia: '/images/fotografia.jpg'});
};