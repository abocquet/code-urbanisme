var attr = DS.attr;

App.Comparaison = DS.Model.extend({

	name: attr('string'),
	date: attr('date'),

	sauvegardes: DS.hasMany('sauvegarde'),
	articles: DS.hasMany('article'),

	download_link: function(){
		return '/comparaison/download/' + this.get('id')
	}.property('id'),

	last_uncommented_article: function(){

		var articles = this.get('articles').filter(function(item){
			return item.get('commentaire') == '' ;
		});

		if(articles.get('length') >= 1){
			return articles.objectAt(0);
		}
		else {
			return this.get('articles').objectAt(0);
		}


	}.property('articles.@each.commentaire')

});