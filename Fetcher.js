var	request = require('request'),
	request_progress = require('request-progress'),
	fs = require('fs'),

	PDFParser = require('pdf2json/pdfparser.js'),
	PDFIterator = require('./PDFIterator.js'),

	EventEmitter = require('events').EventEmitter
;

var Fetcher = function(){

	var self = this ;

	this.filePath = './data/code.pdf' ;

	this.parser = new PDFParser();
	this.EventEmitter = new EventEmitter();

	this.parser.on('pdfParser_dataError', function(err){
		self.EventEmitter.emit('error', err);
	});

	this.parser.on('pdfParser_dataReady', function(res){

		self.EventEmitter.emit('info', 'PDF analysé');

		var articles = {}, article = null ;
		var iterator = new PDFIterator(res);

		while(article = iterator.nextArticle()){
			articles[ article.title ] = article;

			self.EventEmitter.emit('progress', {
				progression: (iterator.current.page.number / iterator.current.page.length) * 100,
				content: "Traitement du PDF ..."
			});
		}

		self.EventEmitter.emit('info', 'Traitement du PDF terminé');
		self.EventEmitter.emit('success', articles)

	});

	this.download = function(url, dest, cb) {

		var self = this ;

		request_progress(request(url), {
			throttle: 50,  // Throttle the progress event to 2000ms, defaults to 1000ms
			delay: 100      // Only start to emit after 1000ms delay, defaults to 0ms
		})
		.on('progress', function (state) {
			self.EventEmitter.emit('progress',{
				progression: (state.received / (1.5 * 1000000)) * 100,
				content: "Téléchargement du PDF ..."
			})
		})
		.on('error', function (err) {
			self.EventEmitter.emit('error', err);
		})
		.pipe(fs.createWriteStream(dest))
		.on('error', function (err) {
			self.EventEmitter.emit('error', err);
		})
		.on('close', function (err) {
			cb();
		})

	}

	this.fetch = function(){

		this.download("http://www.legifrance.gouv.fr/download_code_pdf.do?cidTexte=LEGITEXT000006074075", this.filePath, function(){
			self.EventEmitter.emit('info', 'PDF téléchargé');
			self.EventEmitter.emit('info', 'Analyse du PDF ...');
			self.parser.loadPDF(self.filePath);
		});

		return this.EventEmitter ;
	}
}

module.exports = Fetcher ;