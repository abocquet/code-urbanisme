module.exports = {

	sauvegarde: require('./sauvegarde'),
	comparaison: require('./comparaison'),

	index: function(req, res){
		res.render('public/index.html');
	}

}