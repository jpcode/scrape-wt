var request = require('request');
var cheerio = require('cheerio');
var jsdom = require("node-jsdom");
var fs = require("fs");
var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.min.js","utf-8");
var cheerio = require('cheerio');
var readline = require('readline');
var colors = require('colors/safe');


var exec = require('child_process').exec;

var scrape = {
	url : 'http://utero.pe/',
	desc: 'Utero',
	out: {
		status: 'scrape',
		feeds : []
	}
}
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


function initStdin(){
	rl.on('line', function(line){
		console.log( line );
		if ( line == 'r' ){ 
			console.log('doing r');
			refresh()
		}else{
			var idx = parseInt(line);
		    if ( idx == -1 ) exit();
		    else if ( idx == 0 ) openFeed( scrape.url, scrape.desc  );
		    else{
		    	var feed = scrape.out.feeds[ idx - 1 ];
			    if ( feed ){
			    	openFeed( feed.href, feed.text );
			    }else{
			    	log(' Please select a correct option!!!!!!!', 'error');
			    }
		    }
		}
	    
	})
}

function refresh(){
	log('refresh', 'title');
}

function exit( ){
	log(' Thanks!! Bye', 'title');
	process.exit(1);
}


function openFeed( href , text ){
	exec('start chrome ' + href, function (err) {
    		if ( !err ){
    			console.log(' Opening...' + text );
    		}
    	});
}

function log( msg, type ){
	if ( type == "title") console.log( colors.green.underline( msg ) );
	else if ( type == "separators" ) console.log( colors.rainbow( msg ) );
	else if ( type == "action" ) console.log( msg );
	else if ( type == "list") console.log( colors.magenta( msg ) );
	else if ( type == "error" ) console.log( colors.red( msg ));
}

function makeRequest( url ){
	request( url, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	initStdin();
	  	log('Current List from: ' +  scrape.url , 'title' );
	    var $ = cheerio.load(html);
	    var ind;
	    $('a.bg h2').each(function(i, element){
	    	var href = $(this).parent().attr('href');
	    	var text = $(this).text();
	    	ind = i + 1;
	    	log( ind + " - " + text, "list");
	    	scrape.out.feeds.push({
	    		id : i,
	    		href: href,
	    		text: text
	    	});
	    });
	    log( ">>>>>>>>>>>>>>>>>>>>>>>>", "separators" );
	    log( ' ' + 0   + " -> Go Home Page", "action");
	    log( -1  + " -> Exit or Ctrl + c", "action");
	    log( ' ' + 'r'   + " -> Refresh", "action");
	    log( ">>>>>>>>>>>>>>>>>>>>>>>>", "separators" );
	    log('Type One Feed to open or put 0 and get out here....', "action");
	  }else{
	  	log( "An error ocurred with your feed :(", "error" );
	  	exit();
	  }
	});
}

makeRequest( scrape.url );

