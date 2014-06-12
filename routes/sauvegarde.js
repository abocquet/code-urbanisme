var Fetcher = require('../Fetcher.js'),
	fs = require('fs')
;

module.exports = {

	new: function(req){
		
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

		query.on('success', function(articles){

			req.io.emit('sauvegarde_info', {content: 'Sauvegarde des articles en cours ...'});

			fs.writeFile('./data/code.json', JSON.stringify(articles), function(err) {
				if(err) {
					console.log('erreur');
					console.error(err);
					req.io.emit('sauvegarde_info', {content: JSON.stringify(err), type: 'danger'});
				} else {
					req.io.emit('sauvegarde_info', {content: 'Le code est enregistré', type: 'success'});
					req.io.emit('sauvegarde_success');
				}
			}); 
		});

		req.io.emit('sauvegarde_info', {content: 'La sauvegarde a commencé'});

	}

}