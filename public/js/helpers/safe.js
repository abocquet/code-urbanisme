Ember.Handlebars.registerBoundHelper('safe', function(html) {
  return new Handlebars.SafeString(html);
});