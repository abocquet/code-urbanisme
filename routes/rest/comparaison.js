var mongoose = require('mongoose'),
	Comparaison = mongoose.model('Comparaison'),
	Article = mongoose.model('Article'),
	Sauvegarde = mongoose.model('Sauvegarde'),

	fs = require('fs'),
	Q = require('q'),
	_ = require('lodash'),
	sd =  require('simplediff')
;

var routes = {

	get: function(req, res){

		var params = {}, response = {
			comparaisons: [],
			articles: [],
			sauvegardes: []
		};

		if(req.params.id)
			params._id = req.params.id ;

		Comparaison
		.find(params)
		.populate('articles')
		.populate('sauvegardes')
		.exec(function(err, comparaisons){
			if(err){ console.error(err); }

			for (var i = 0; i < comparaisons.length; i++) {

				var sauvegardes = comparaisons[i].sauvegardes, sauvegardes_id = [] ;
				for (var y = 0; y < sauvegardes.length; y++) {
					response.sauvegardes.push(sauvegardes[y]);
					sauvegardes_id.push(sauvegardes[y]._id);
				};

				var articles = comparaisons[i].articles, articles_id = [] ;
				for (var y = 0; y < articles.length; y++) {
					response.articles.push(articles[y]);
					articles_id.push(articles[y]._id);
				};

				comparaisons[i].sauvegardes = sauvegardes_id ;
				comparaisons[i].articles = articles_id ;

				response.comparaisons.push(comparaisons[i]);
			};

			response.comparaisons = _.uniq(response.comparaisons, function(c){ return c._id ; })
			response.articles = _.uniq(response.articles, function(a){ return a._id ; })

			res.json(response);
		});
	},

	post: function(req, res){
		var comparaison = req.body ;
		var sauvegardes = [];

		for (var i = 0; i < comparaison.sauvegardes.length; i++) {
			
			var content = JSON.parse(fs.readFileSync('./data/' + comparaison.sauvegardes[i] + '.json')), keys= [];
			for(var k in content) keys.push(k);

			sauvegardes.push({
				content: content,
				keys: keys
			});
		};

		var articles = {}
			articles.ajoutes = sauvegardes[1].keys.diff(sauvegardes[0].keys);
			articles.supprimes = sauvegardes[0].keys.diff(sauvegardes[1].keys);
			articles.modifies = [];

		var articles_untouched = _.intersection(sauvegardes[0].keys, sauvegardes[1].keys);

		for (var i = 0; i < articles_untouched.length; i++) {
			if(sauvegardes[0]['content'][ articles_untouched[i] ].content != sauvegardes[1]['content'][ articles_untouched[i] ].content){
				articles.modifies.push(articles_untouched[i]);
			}
		};


		Comparaison.create(comparaison, function(err, model){

			if(err){
				console.error(err);
				throw err ;
			}

			var articles_saved = 0, 
				articles_to_save = articles.ajoutes.length + articles.supprimes.length + articles.modifies.length
			;

			var callback = function(){
				articles_saved++ ;
				
				if(articles_saved == articles_to_save){

					model.save(function(){
						req.params.id = model._id ;
						routes.get(req, res);
					})

				}

			}

			for(var type in articles){

				var state = 0 ;
				switch(type){
					case "ajoutes":
						state = 1;
						break ;
					case "modifies":
						state = 0;
						break ;
					case "supprimes":
						state = -1;
						break ;
					default: 
						break;
				}

				for (var i = 0; i < articles[type].length; i++) {
					Article.create({
						name: articles[type][i],
						state: state,
						comparaison: model._id
					}, callback);
				};
			}

		});
	},

	differences: function(req, res){
		Comparaison
		.findById(req.params.id, function(err, comparaison){

			if(err){ console.error(err) ; throw err ;}

			var old = JSON.parse(fs.readFileSync('./data/' + comparaison.sauvegardes[0] + '.json'))[req.params.article] ;
			var recent = JSON.parse(fs.readFileSync('./data/' + comparaison.sauvegardes[1] + '.json'))[req.params.article] ;

			if(!old){ res.send(recent.content); }
			else if(!recent){ res.send(old.content); }
			else {
				res.send(sd.htmlDiff(old.content, recent.content));
			}
		})
	}
}

module.exports = routes ;