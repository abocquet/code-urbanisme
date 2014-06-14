module.exports = {

	io: {
		sauvegarde: require('./io/sauvegarde.js'),
		comparaison: require('./io/comparaison.js')
	},

	rest: {
		sauvegarde: require('./rest/sauvegarde.js'),
		comparaison: require('./rest/comparaison.js'),
		article: require('./rest/article.js')
	},

	index: function(req, res){
		res.render('public/index.html');
	}

}