Ember.Handlebars.registerBoundHelper('format_article', function(content) {

	if(!content){ content = '' ;}

	return new Handlebars.SafeString("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + content.replace(/\n/g, '</br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'));
});