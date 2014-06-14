Ember.Handlebars.registerBoundHelper('objectAt', function(array, key , property) {
	return array.objectAt(key).get(property);
});