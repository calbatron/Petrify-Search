var Q 						= 	require('q');
var q 						=	require('./quick-console.js');	
var http				 	= 	require('http');
var parseString 			= 	require('xml2js').parseString;


module.exports = {

	gettingProgress: 0,
	recievedProgress: 0,
	totalPages: 0,
	init: function(json) {

		var deferred = Q.defer();

		q.c('Started iSite search', 1);

		this.loopUrls(json)
		.then(this.loopLocations)
		.then(function(articles) {
			console.log(articles);
				deferred.resolve;	
		});

		return deferred.promise;	
	},

	loopUrls: function(json) {

		var promises = []
		var htmlFiles = []
		this.totalPages = json.length;

		for (var k in json) {
			promises.push(this.getAddress(json[k]));
		}	

		return Q.all(promises);
	},

	getAddress: function(url) {

		var deferred = Q.defer();

		var page = url.replace(global.appUrl, "");

		if (page.indexOf('/artwork/') === 0) {
			
			var loc = page.lastIndexOf('/view/');
			var ret = "Artwork- ";
			ret += page.slice(loc + 6);
			var type = "artwork";
			deferred.resolve({"type":"artwork", "loc":ret, "url":url});
		}

		if (page.indexOf('/artist/') === 0) { 

			var loc = page.lastIndexOf('/view/');
			var ret = "";
			ret += page.slice(loc + 6);
			var type = "artist";
			deferred.resolve({"type":"artist", "loc":ret, "url":url});

		}

		if (page.indexOf('/news/') === 0) { 
			
			var loc = page.lastIndexOf('/view/');
			var ret = "News - ";
			ret += page.slice(loc + 6);
			var type = "news";
			deferred.resolve({"type":"news", "loc":ret, "url":url});

		}

		return deferred.promise;	

	},

	loopLocations: function(location) {
		
		var promises = []
		this.totalPages = location.length;

		for (var loop = 0 ; loop < location.length; loop++) {

			promises.push(module.exports.getLocationData(location[loop].loc, location[loop].type, location[loop].url));
		}

		return Q.all(promises);

	},

	getLocationData: function(loc, type, weburl) {

		var deferred = Q.defer();
		var chunk = "";

		var url = "http://data.bbc.co.uk/isite2-content-reader-thespace/v1/content/file/?depth=2&project=thespace&apikey=igmFSCJQ671aEG2aJtMi7QijOGIfagjW&id=";
		url += loc;

		http.get(url, function(res) {

			module.exports.gettingProgress++;
			q.c(module.exports.gettingProgress + "/" + module.exports.totalPages + ": Getting XML " + url, 3, 5);

			res.on('data', function(e) {	

				chunk += e
			})
			res.on('end', function() {

				module.exports.recievedProgress++;
				q.c(module.exports.recievedProgress + "/" + module.exports.totalPages + ": Recieved XML " + url, 2, 5);
				//deferred.resolve({"url":url, "html":chunk});

				module.exports.convertData(chunk).then(function(json){
					module.exports.extractData(json, type, weburl).then(function(article) {
						deferred.resolve(article);	
					});
					
				});		

			})
		})

		return deferred.promise;	
	},

	convertData: function(xml) {

		var deferred = Q.defer();

		parseString(xml, function(err, result) {
			if (err) {
				q.c('there is an error with parseXML', 0, 4);
			}
			else {
				deferred.resolve(result);
			}
		});

		return deferred.promise;	

	},

	extractData: function(json, type, url) {

		var deferred = Q.defer();

		switch (type) {
			case "artist" : {
				var file = json.result.document[0].form[0].contributor[0];	

				var type = "Artist";
				var image = file.promo_image[0];
				var title = file.name[0] + " " + file.surname[0];
				var author = "";
				var summary = file.intro[0];
				var link = url;

				var article = 	{
									"type" 		:	type,
									"image" 	:	image,
									"title"		:	title,
									"author"	:	author,
									"summary"	:	summary,
									"link"		:	link
								}

				deferred.resolve(article);			

				break;
			}

			case "artwork" : {
				var file = json.result.document[0].form[0].artwork[0];
				var type = "Artwork";
				var image = file.promo[0];
				var title = file.title[0];
				var author = 
					file.artist[0]["artist-iteration"][0]["artist_file"][0].result[0].document[0].form[0].contributor[0].name[0] 
					+ " " +
					file.artist[0]["artist-iteration"][0]["artist_file"][0].result[0].document[0].form[0].contributor[0].surname[0] 
				var summary = file.intro[0];
				var link = url;

				var article = 	{
									"type" 		:	type,
									"image" 	:	image,
									"title"		:	title,
									"author"	:	author,
									"summary"	:	summary,
									"link"		:	link
								}

				deferred.resolve(article);

				break;
			}

			case "news" : {
				var file = json.result.document[0].form[0].news[0];
				var type = "News";
				var image = file.image[0];

				var title = file.title[0];
				var author = file.author[0];
				var summary = file.summary[0];
				var link = url;



				var article = 	{
									"type" 		:	type,
									"image" 	:	image,
									"title"		:	title,
									"author"	:	author,
									"summary"	:	summary,
									"link"		:	link
								}
				
				deferred.resolve(article);

				break;
			}
			default : { console.log("type not found " + type)}
		}
		
		return deferred.promise;	
	}
}