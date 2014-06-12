App.SauvegardeNouvelleController = Ember.ArrayController.extend({

	content: [],
	processing: false,
	
	sortProperties: ['date'],
	sortAscending: false,

	current_progress: {content: ''},

  	name: 'Sauvegarde du ' + (new Date()).getMonth() + '/' + (new Date()).getDate() + ' à ' + (new Date()).getHours() + ':' + (new Date()).getMinutes(),

  	actions: {
  		start: function(){
  			this.set('processing', true);
  			this.socket.emit('sauvegarde:new');
  		}
  	},

	sockets: {

		sauvegarde_info: function(info){

			info.date = new Date();
			info.type = 'alert-' + (info.type || 'info');

			this.get('content').addObject(info);
			this.set('current_progress.progression', "width: 100%;");
		},

		sauvegarde_progress: function(progress){

			progress.progression = "width: " + progress.progression + "%;";

			if(progress.content == this.get('current_progress.content')){
				this.set('current_progress.progression', progress.progression);
			}
			else {
				this.set('current_progress.progression', "width: 100%;");

				progress.date = new Date();
				progress.type = 'alert-info' ;

				this.get('content').addObject(progress);
				this.set('current_progress', progress);
			}
		}

	}

});