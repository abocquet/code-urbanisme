App.SauvegardeShowController = Ember.Controller.extend({

	search: '',
	searched_articles: function(){

		var self = this ;

		Ember.$
		.get('/sauvegardes/' + this.get('sauvegarde._id') + '/list/' + this.get('search'))
		.then(function(res){
			self.set('sauvegarde', res);
		})

	}.observes('search')

});
