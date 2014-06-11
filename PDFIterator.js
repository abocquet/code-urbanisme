var url = require('urlencode');

var PDFIterator = function(json){

	this.pages = json.data.Pages ;
	this.current = {
		page: {
			number: 0,
			length: this.pages.length - 1
		}, 
		text: {
			number: 0,
			length: this.pages[0].Texts.length
		}
	}

	this.types = {
		title: [0, 18, 1, 0],
		text:  [0, 15, 0, 0]
	}

	this.nextElement = function(){

		this.current.text.number++
		
		if(this.current.text.number >= this.current.text.length){
			this.current.text.number = 0;
			this.current.page.number++ ;
		}

		console.log(this.current);

		if(this.current.page.number < this.current.page.length)
		{
			this.current.text.length = this.pages[ this.current.page.number ].Texts.length ;
			return this.currentElement() ;
		}
		else {
			this.current.text.number = 0;
			this.current.text.length = 1000;

			return false ;
		}
	}

	this.currentElement = function(){

		var current = this.pages[ this.current.page.number ].Texts[ this.current.text.number ].R[0],
			type = "" ;

			 if(this.types.title.equals(current.TS)){ type = "TITLE" }
		else if(this.types.text.equals(current.TS)) { type = "TEXT" }
		else { type = "OTHER" }

		return {
			content: current.T,
			type: type,
			TS: current.TS
		};
	}

	this.whileType = function(type){

		var content = '',
			element = this.currentElement()
		;		

		if(element == false){ return false ;}

		while(element.type == type){
			content += element.content + ' ';
			element = this.nextElement();
			if(element == false){ return false ;}
		}

		return url.decode(content) ;
	}

	this.whileNotType = function(type){

		var content = '',
			element = this.currentElement()
		;

		if(element == false){ return false ;}

		while(element.type != type){
			content += element.content + ' ';
			element = this.nextElement();
			if(element == false){ return false ;}
		}

		return url.decode(content) ;
	}

	this.nextArticle = function(){
		var article = { title: "rien" } ;

		this.whileNotType("TITLE");
		article.title = this.whileType("TITLE");

		this.whileNotType("TEXT");
		article.content = this.whileType("TEXT");


		if(!article.title || !article.content){ console.log('false') ; return false; }
		return article ;
	}
};

module.exports = PDFIterator ;