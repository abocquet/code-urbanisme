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
			this.route('print');
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
			name: 'Sauvegarde du ' + (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear()
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
		return this.store.find('comparaison', this.modelFor('comparaison').id);
	}
});

App.ComparaisonExportRoute = Ember.Route.extend({
	model: function(params){
		return this.store.find('comparaison', this.modelFor('comparaison').id);
	}
});

App.ComparaisonPrintRoute = Ember.Route.extend({
	model: function(params){
		return this.store.find('comparaison', this.modelFor('comparaison').id);
	},

	setupController: function(controller, model){

		controller.set('model', model);

		model.get('articles').forEach(function(item, index){

			console.log(item.get('modifie'));
			if(item.get('modifie'))
			{
				console.log('bip')
				Ember.$.get('/comparaison/' + item.get('comparaison.id') + '/differences/' + item.get('name')).then(function(data){
					console.log(data)
					item.set('differences', data);
				});
			}

		});

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
