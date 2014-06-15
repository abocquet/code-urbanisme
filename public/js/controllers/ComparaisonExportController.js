App.ComparaisonExportController = Ember.Controller.extend({

	download_link: function(){
		return '/comparaison/download/' + this.get('comparaison.id') ;
	}.property('comparaison')

});