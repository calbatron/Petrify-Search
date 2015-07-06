var Q 						= 	require('q');
var sitemap					=	require('./petrify-sitemap.js');
var isite					=	require('./petrify-isite.js');
var q 						=	require('./quick-console.js');

module.exports = {
	url: "",
	sitemap: "",
	details: 0,
	fullUrl: "",
	init: function() {

		q.mode = this.details;
		q.c('Welcome to Petrify', 1, 1);

		global.appUrl = this.url;

		if (typeof this.sitemap === "object") {
			
			isite.init(this.sitemap)
			.then(function() {

			})	
			.catch(function(err) { console.log(err)})
			.done();			

		}
		else if (typeof this.sitemap === "string") {
			global.fullUrl = this.url + this.sitemap;	

		 
			// .catch(function(err) { console.log(err)})
			// .done();
		}	
	}

}