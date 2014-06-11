var	http = require('http'),
	fs = require('fs'),

	PDFParser = require('pdf2json/pdfparser.js'),
	PDFIterator = require('./PDFIterator.js'),

	EventEmitter = require('events').EventEmitter
;

var Fetcher = function(){

	var self = this ;

	this.parser = new PDFParser();
	this.EventEmitter = new EventEmitter();

	this.parser.on('pdfParser_dataError', function(err){
		self.EventEmitter.emit('error', err);
	});

	this.parser.on('pdfParser_dataReady', function(res){

		self.EventEmitter.emit('pdf_parsed');

		var articles = [], article = null ;
		var iterator = new PDFIterator(res);

		while(article = iterator.nextArticle()){
			articles.push(article);

			self.EventEmitter.emit('parse_progress', (iterator.current.page.number / iterator.current.page.length) * 100)
		}

		self.EventEmitter.emit('success', articles)

	});

	this.download = function(url, dest, cb) {

		var file = fs.createWriteStream(dest);
		var request = http.get(url, function(response) {
			response.pipe(file);
			file.on('finish', function() {
				file.close(cb);  // close() is async, call cb after close completes.
			});
		});
	}

	this.fetch = function(){

		this.download("http://www.legifrance.gouv.fr/download_code_pdf.do?cidTexte=LEGITEXT000006074075", "./tmp/code.pdf", function(){
			self.EventEmitter.emit('pdf_fetched', 1/4);
			self.parser.loadPDF('./tmp/code.pdf');
		});

		return this.EventEmitter ;
	}
}

module.exports = Fetcher ;