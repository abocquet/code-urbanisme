var Fetcher = require('../../Fetcher.js'),
	fs = require('fs'),

	mongoose = require('mongoose'),
	Sauvegarde = mongoose.model('Sauvegarde')
;

module.exports = {

	articles: [],
	new: function(req){
		
		var self = this ;

		var fetcher = new Fetcher(),
			query = fetcher.fetch();

		query.on('info', function(info){
			req.io.emit('sauvegarde_info', {content: info});
		});

		query.on('error', function(error){
			console.error(error);
			req.io.emit('sauvegarde_info', {content: JSON.stringify(error), type: 'danger'});
		});

		query.on('progress', function(progress){
			req.io.emit('sauvegarde_progress', progress);
		});

		query.on('success', function(res){
			self.articles = res ;
			req.io.emit('choose_name');
		})

		req.io.emit('sauvegarde_info', {content: 'La sauvegarde a commencé'});
	},

	save: function(req){

		var self = this ;

		console.log(self.articles.length);

		req.io.emit('sauvegarde_info', {content: 'Sauvegarde des articles en cours ...'});
		Sauvegarde.create({
			name: req.data,
			nombre_articles: self.articles.length
		}, function(err, sauvegarde){

			if(err) { 
				console.error(error);
				req.io.emit('sauvegarde_info', {content: JSON.stringify(err), type: 'danger'});
			}

			fs.writeFile('./data/' + sauvegarde._id + '.json', JSON.stringify(self.articles), function(err) {
				if(err) {
					console.log('erreur');
					console.error(err);
					req.io.emit('sauvegarde_info', {content: JSON.stringify(err), type: 'danger'});
				} else {
					req.io.emit('sauvegarde_info', {content: 'Le code est enregistré', type: 'success'});
					req.io.emit('sauvegarde_done');
				}
			}); 

		});
	}


}