var Fetcher = require('../../Fetcher.js'),
	fs = require('fs'),

	mongoose = require('mongoose'),
	Sauvegarde = mongoose.model('Sauvegarde')
;

var self = {

	clients: {},

	new: function(req){
		
		self.clients[req.io.socket.id] = { processing: true };

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

			self.clients[req.io.socket.id].articles = res ;

			Sauvegarde
			.findOne()
			.sort('-date')
			.exec(function(err, last_sauvegarde){

				if(err){ throw err ; req.io.emit('sauvegarde_info', {content: JSON.stringify(err), type: 'danger'});}

				var ref = '' ;
				if(last_sauvegarde){
					ref = fs.readFileSync('./data/' + last_sauvegarde._id + '.json');
				}

				if(ref == JSON.stringify(self.clients[req.io.socket.id].articles)){
					self.clients[req.io.socket.id].processing = false ;	
					req.io.emit('sauvegarde_useless');	
				}
				else {
					req.io.emit('choose_name');
				}

			});

		})

		req.io.emit('sauvegarde_info', {content: 'La sauvegarde a commencé'});
	},

	save: function(req){

		var articles = self.clients[req.io.socket.id].articles ;

		req.io.emit('sauvegarde_info', {content: 'Sauvegarde des articles en cours ...'});
		Sauvegarde.create({
			name: req.data,
			nombre_articles: articles.length
		}, function(err, sauvegarde){

			if(err) { 
				console.error(error);
				req.io.emit('sauvegarde_info', {content: JSON.stringify(err), type: 'danger'});
			}

			fs.writeFile('./data/' + sauvegarde._id + '.json', JSON.stringify(articles), function(err) {
				if(err) {
					console.error(err);
					req.io.emit('sauvegarde_info', {content: JSON.stringify(err), type: 'danger'});
				} else {
					req.io.emit('sauvegarde_info', {content: 'Le code est enregistré', type: 'success'});
					req.io.emit('sauvegarde_done');


					self.clients[req.io.socket.id].processing = false ;	
					var clients = self.clients ;

					self.clients = {};
					for(client in clients){
						if(clients[client].processing)
						{
							self.clients[client] = client ;
							console.log(self.clients);
						}
					}
				}
			}); 

		});
	}
}

module.exports = self ;