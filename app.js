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

var app = express().http().io();

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
	// .get('/sauvegardes/:id/content', routes.rest.sauvegarde.content)
	.get('/sauvegardes/:id/list/:search?', routes.rest.sauvegarde.list)

	.get('/comparaisons/:id?', routes.rest.comparaison.get)
	.get('/comparaison/:id/differences/:article', routes.rest.comparaison.differences)

	.get('/comparaison/download/:id', routes.rest.comparaison.export)

	.post('/comparaisons', routes.rest.comparaison.post)

	.put('/articles/:id', routes.rest.article.put)
	.put('/comparaisons/:id', routes.rest.comparaison.put)
	.put('/comparaisons/:id', routes.rest.article.put)
;

app.listen(8888);
