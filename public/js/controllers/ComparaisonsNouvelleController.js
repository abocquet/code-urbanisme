App.ComparaisonsNouvelleController = Ember.Controller.extend({

	afterSauvegardes: function(){

		var dateRef = this.get('firstSauvegarde.date') ;

		return this.get('sauvegardes').filter(function(item){
			if(item.get('date') > dateRef) {
				return true;
			}
		});

	}.property('firstSauvegarde', 'sauvegardes'),

	name: function(){

		return "Comparaison entre " + this.get('firstSauvegarde.name') + " et " + this.get('secondSauvegarde.name');

	}.property('firstSauvegarde', 'secondSauvegarde'),

	actions: {
		create: function(){
			var self = this ;

			Ember.$.post('/comparaisons', {
				name: this.get('name'),
				sauvegardes: [
					this.get('firstSauvegarde.id'),
					this.get('secondSauvegarde.id')
				]
			}).then(function(res){
				self.transitionToRoute('comparaison.show', res.comparaisons[0]._id);
			});
		}
	}

});