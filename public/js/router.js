App.Router.map(function() {

	this.resource('sauvegarde', function(){

		this.route('nouvelle');
		this.route('show', {path: '/:sauvegarde'});
	});

	this.resource('comparaisons', function(){

		this.route('nouvelle');
		this.route('export');
		this.route('commenter');

		this.resource('comparaison', {path: '/:id'}, function(){
			this.route('show', {path: '/'});
			this.route('export');
			this.route('commenter', {path: '/commenter/:index'});
		});

	});
	
});

App.SauvegardeIndexRoute = Ember.Route.extend({

	model: function(){
		return this.store.find('sauvegarde');
	}
});

App.SauvegardeShowRoute = Ember.Route.extend({

	model: function(params){
		return Ember.$.get('/sauvegardes/' + params.sauvegarde + '/list');
	},

	setupController: function(controller, model){
		controller.set('sauvegarde', model);
	}

});

App.SauvegardeNouvelleRoute = Ember.Route.extend({
	setupController: function(controller, model){

		controller.setProperties({
			content: [],

			processing: false,
			logVisible: true,
			done: false,
			useless: false,

			choosing_name: false,
			name: 'Sauvegarde du ' + (new Date()).getMonth() + '/' + (new Date()).getDate() + ' à ' + (new Date()).getHours() + ':' + (new Date()).getMinutes()
		});

	}
})

App.ComparaisonsIndexRoute = Ember.Route.extend({

	model: function(){
		return this.store.find('comparaison');
	}
});

App.ComparaisonsExportRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('comparaison');
	}
});

App.ComparaisonsCommenterRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('comparaison');
	}
});

App.ComparaisonShowRoute = Ember.Route.extend({
	model: function(params){
		return this.modelFor('comparaison');
	}
});

App.ComparaisonExportRoute = Ember.Route.extend({
	model: function(params){
		return this.modelFor('comparaison');
	}
});


App.ComparaisonCommenterRoute = Ember.Route.extend({
	model: function(params){
		var comparaison_id = this.modelFor('comparaison').id, self = this ;

		return new Ember.RSVP.Promise(function(resolve, reject){

			self.store.find('comparaison', comparaison_id).then(function(comparaison){
				resolve(comparaison.get('articles').objectAt(params.index));
			});

		});
	},

	afterModel: function(model, transition){

		if(model == undefined)
			this.transitionTo('comparaison.export');

	},

	setupController: function(controller, model){
		controller.set('model', model);
		controller.set('model.indexFrom1', controller.get('model.index') + 1);

		Ember.$.get('/comparaison/' + model.get('comparaison.id') + '/differences/' + model.get('name')).then(function(data){
			model.set('differences', data);
		});
	}
});

App.ComparaisonsNouvelleRoute = Ember.Route.extend({

	model: function(){
		return this.store.find('sauvegarde');
	},

	setupController: function(controller, model) {

		controller.set('sauvegardes', model);
		controller.set('firstSauvegarde', model.objectAt(0));
	}
});
