var mongoose = require('mongoose'),
	relationship = require("mongoose-relationship")
;

/*
	+1: created
	0: modified
	-1: deleted
*/

var ArticleSchema = mongoose.Schema({
	name: String,
	state: Number, 
	commentaire: String,

	comparaison: {type: mongoose.Schema.Types.ObjectId, ref: 'Comparaison', childPath: 'articles'}
});

ArticleSchema.plugin(relationship, { relationshipPathName:'comparaison'});

var Article = mongoose.model('Article', ArticleSchema);