Ember.Handlebars.registerBoundHelper('format_date', function(date) {
  return date.getDate() + ' / ' + date.getMonth() + ' / ' + date.getFullYear() ;
});