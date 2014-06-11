'use strict' ;

require('./array.js');

var express = require('express'),
	url = require('urlencode'),

	PDFParser = require('pdf2json/pdfparser.js'),
	PDFIterator = require('./PDFIterator.js')
;

var parser = new PDFParser();

parser.on('pdfParser_dataError', function(err){
	console.log(err);
});

parser.on('pdfParser_dataReady', function(res){

	var articles = [], article = null ;
	var iterator = new PDFIterator(res);

	while(article = iterator.nextArticle()){
		console.log(article);
	}

});

parser.loadPDF('./code.pdf');