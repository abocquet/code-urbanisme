var attr = DS.attr;

App.Comparaison = DS.Model.extend({

	name: attr('string'),
	date: attr('date'),

	sauvegardes: DS.hasMany('sauvegarde'),
	articles: DS.hasMany('article')

});