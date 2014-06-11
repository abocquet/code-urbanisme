var mongoose = require('mongoose');

var ArticleSchema = mongoose.Schema({
	name: String, 
	content: String
})

var SauvegardeSchema = mongoose.Schema({

	name: String,
	date: { type: Date, default: Date.now },
	articles: [ ArticleSchema ]

});

var Sauvegarde = mongoose.model('Sauvegarde', SauvegardeSchema);