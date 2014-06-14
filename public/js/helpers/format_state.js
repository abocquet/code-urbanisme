Ember.Handlebars.registerBoundHelper('format_state', function(state) {

	switch(state){
		case 1:
			return 'ajouté' ;
			break ;
		case 0:
			return 'modifié' ;
			break ;
		case -1:
			return 'supprimé' ;
			break ;
	}

});