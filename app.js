'use strict' ;

require('./array.js');

var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/urbanisme');

var express = require('express.io'),
	routes = require('./routes')
;

var app = express();
 	app.http().io();

app.use(express.static('public/'));
app.get('/', routes.index);

app.io.route('sauvegarde', routes.sauvegarde);
app.io.route('comparaison', routes.comparaison);

app.listen(8888);

// var Fetcher = require('./Fetcher.js'),
// 	fetcher = new Fetcher()
// ;

// var query = fetcher.fetch();

// query.on('success', function(articles){
// 	console.log('success');
// })


// query.on('progress', function(a){
// 	console.log(a);
// })

// query.on('error', function(a){
// 	console.log(a);
// })