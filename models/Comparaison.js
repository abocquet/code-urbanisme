var mongoose = require('mongoose');

var ComparaisonSchema = mongoose.Schema({

	name: String,
	date: { type: Date, default: Date.now },

	sauvegardes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Sauvegarde'}],
	articles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}]

});

var Comparaison = mongoose.model('Comparaison', ComparaisonSchema);