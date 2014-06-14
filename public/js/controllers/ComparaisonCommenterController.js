App.ComparaisonCommenterController = Ember.ObjectController.extend({

	actions: {
		next: function(){
			this.moveTo( this.get('model.index') + 1) ;
		},

		previous: function(){
			this.moveTo( this.get('model.index') - 1) ;
		},

		to: function(){
			var index = this.get('model.indexFrom1');
			if(index > 0 && index <= this.get('model.comparaison.articles.length')){
				this.moveTo(index - 1);
			}
		}
	},

	moveTo: function(index){
		this.get('model').save();
		this.transitionToRoute('comparaison.commenter', index);
	}

});