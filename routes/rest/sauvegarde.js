var mongoose = require('mongoose'),
	Sauvegarde = mongoose.model('Sauvegarde'),

	fs = require('fs'),
	_ = require('lodash'),
	urlencode = require('urlencode')
;

module.exports = {

	get: function(req, res){

		var params = {};
		if(req.params.id)
			params.id = req.params.id ;

		Sauvegarde.find(params, function(err, sauvegardes){
			if(err){ console.error(err); }
			res.json({
				sauvegardes: sauvegardes
			});
		});
	},

	list: function(req, res){

		Sauvegarde.findOne({_id: req.params.id}, function(err, sauvegarde){
			if(err){ console.error(err); }

			if(!sauvegarde){ res.send(404); }
			else {

				var articles = [], file = JSON.parse(fs.readFileSync('./data/' + sauvegarde._id + '.json'));
				for(article in file){
					articles.push(file[article]);
				}

				var search = req.params.search ? urlencode.decode(req.params.search).toLowerCase() : '' ;
				articles = articles.filter(function(item){
					return item.title.toLowerCase().indexOf(search) != -1 ;
				}).splice(0, 20);

				res.json({
					_id: sauvegarde._id,
					name: sauvegarde.name,
					date: sauvegarde.date,

					articles: articles
				});
			}
		});
	},

	content: function(req, res){

		Sauvegarde.findOne({_id: req.params.id}, function(err, sauvegarde){
			if(err){ console.error(err); }

			if(!sauvegarde){ res.send(404); }
			else {
				res.json({
					_id: sauvegarde._id,
					name: sauvegarde.name,
					date: sauvegarde.date,
					article: JSON.parse(fs.readFileSync('./data/' + sauvegarde._id + '.json'))[req.params.article]
				});
			}
		});
	},

	put: function(req, res){

		Sauvegarde.findOneAndUpdate({_id: req.params.id}, {name: req.body.sauvegarde.name }, function(err, sauvegarde){
			if(err){ console.error(err); }
			res.json({
				sauvegardes: sauvegarde
			});
		})
	}
	
}