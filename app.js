'use strict' ;

require('./array.js');

var mongoose = require('mongoose'),
	models = require('./models')
;
	mongoose.connect('mongodb://localhost/urbanisme');

var express = require('express.io'),
	bodyParser = require('body-parser'),
	routes = require('./routes')
;

var app = express();
 	app.http().io();

app
	.use(express.static('public/'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded())
;

app.get('/', routes.index);

app.io.route('sauvegarde', routes.io.sauvegarde);
app.io.route('comparaison', routes.io.comparaison);

app
	.get('/sauvegardes/:id?', routes.rest.sauvegarde.get)
	.get('/comparaisons/:id?', routes.rest.comparaison.get)
	.get('/comparaison/:id/differences/:article', routes.rest.comparaison.differences)

	.post('/comparaisons', routes.rest.comparaison.post)

	.put('/articles/:id', routes.rest.article.put)
;

app.listen(8888);
