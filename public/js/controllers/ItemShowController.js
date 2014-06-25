App.ItemShowController = Ember.ObjectController.extend({

	display: false,

	actions: {
		show: function(){
			this.set('display', true);
		},

		hide: function(){
			this.set('display', false);
		}
	}

});