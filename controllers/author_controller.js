// GET author
exports.index = function(req, res){
	res.render('author/index',
		{nombre: 'Manuel Cárdenas Thorlund',
		fotografia: '/images/fotografia.jpg'});
};