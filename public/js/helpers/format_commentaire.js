Ember.Handlebars.registerBoundHelper('format_commentaire', function(commentaire) {

	if(typeof commentaire == 'string'){

		result = commentaire.substr(0, 50);
		if(commentaire.length > 50){
			result += '...';
		}
		return result ;

	}
	else {
		return new Handlebars.SafeString('<em>Aucun commentaire</em>');
	}

});