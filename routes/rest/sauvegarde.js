var mongoose = require('mongoose'),
	Sauvegarde = mongoose.model('Sauvegarde')
;

module.exports = {

	get: function(req, res){

		var params = {};
		if(req.params.id)
			params.id = req.params.id ;

		Sauvegarde.find(params, function(err, sauvegardes){
			if(err){ console.error(err); }
			res.json({
				sauvegardes: sauvegardes
			});
		})
	}	
	
}