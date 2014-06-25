App.ItemEditController = Ember.ObjectController.extend({

	actions: {
		edit: function(){
			this.set('editing', true);
		},

		save: function(){
			this.get('model').save();
			this.set('editing', false);
		}
	}

});