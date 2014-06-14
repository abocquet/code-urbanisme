var attr = DS.attr;

App.Sauvegarde = DS.Model.extend({

	name: attr('string'),
	date: attr('date'),
	nombre_articles: attr('number'),
	// comparaison: DS.belongsTo('comparaison')

});