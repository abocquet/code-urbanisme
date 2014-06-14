var attr = DS.attr;

App.Article = DS.Model.extend({

	name: attr('string'),
	commentaire: attr('string'),
	state: attr('number'),

	comparaison: DS.belongsTo('comparaison'),

	index: function(){
		return this.get('comparaison.articles').indexOf(this);
	}.property('comparaison'),

	indexFrom1: function(){
		return this.get('index') + 1 ;
	}.property('index'),

	ajoute: function(){ return this.get('state') == 1 }.property('state'),
	supprime: function(){ return this.get('state') == -1 }.property('state')

});