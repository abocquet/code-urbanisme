var mongoose = require('mongoose'),
	Article = mongoose.model('Article')
;

module.exports = {

	put: function(req, res){

		Article.findOneAndUpdate({_id: req.params.id}, {commentaire: req.body.article.commentaire }, function(err, article){
			if(err){ console.error(err); }
			res.json({
				articles: article
			});
		});
	}
	
}