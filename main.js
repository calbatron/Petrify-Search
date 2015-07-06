var PetriSearch = require('./lib/petrify-search-main.js');


//set url for sitemap
PetriSearch.url = "http://www.thespace.org";
//location of sitemap or array of urls
PetriSearch.sitemap = 	
					[
					"http://www.thespace.org/artwork/view/johnpeel",
					"http://www.thespace.org/artwork/view/fka-twigs-soundtrack7",
					"http://www.thespace.org/artist/view/robbjohnson",
					"http://www.thespace.org/artist/view/jimboulton",
					"http://www.thespace.org/news/view/togetherwebwewant",
					"http://www.thespace.org/news/view/cathlecouteurinterview"
					];

//Petrify.sitemap = "/sitemap.xml";
//details you want in the site map
PetriSearch.details = 2;

PetriSearch.init();

