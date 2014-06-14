var mongoose = require('mongoose');

var SauvegardeSchema = mongoose.Schema({

	name: String,
	nombre_articles: Number,
	date: { type: Date, default: Date.now }

});

var Sauvegarde = mongoose.model('Sauvegarde', SauvegardeSchema);