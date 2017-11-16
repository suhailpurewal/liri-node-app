var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require ("node-spotify-api");
var request = require("request");
var colors = require("colors");
var twitterKeys = keys.twitterKeys;
var command = process.argv[2];
var input = process.argv[3];
	for(i=4; i<process.argv.length; i++){
	    input += '+' + process.argv[i];
	}


switch (command){
	case "my-tweets":
	console.log("in tweets state")
	tweet();
	break;

	case "spotify-this-song":
	console.log("in spotify state")
	// spotify();
	break;

	case "movie-this":
	console.log("in movie state")
	omdb();
	break;

	case "do-what-it-says":
	console.log("in random state")
	// doIt();
	break;

	default:
	console.log("possible commands: my-tweets, spotify-this-song, movie-this or do-what-it-says")

}
function tweet(){
	var client = new twitter(keys);
	var params = {screen_name: twitterUsername, count: 15};
	var twitterUsername = process.argv[3];
		if(!twitterUsername){
			twitterUsername = "suhail_purewal";
		}
		
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if(!error){
				for (i=0; i<data.length; i++){
					var trimmedTweet = ('Number: ' + (i+1) + '\n' + data[i].created_at + '\n' + data[i].text + '\n');
					console.log(trimmedTweet);
					console.log("---------------------")
				}
			}
			else if(error){
				console.log(error)
		}
		});
	}
// function spotify(){

// }
function omdb(){
	var movie = input;
	if(movie === undefined){
	movie = "Mr. Nobody";
	}
	request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy", function(error, response, body) {
  if (!error && response.statusCode === 200) {
  	json = JSON.parse(body)
    console.log(colors.rainbow("-------------------------------------------------------------------"));
    console.log("Title: ".green + json.Title.blue);
	console.log("Year: ".green + json.Year.blue);
	console.log("IMDB Rating: ".green + json.imdbRating.blue);
	console.log("Rotten Tomatoes Rating: ".green + json.Ratings[2].Value.blue);
	console.log("Language: ".green + json.Language.blue);
	console.log("Plot: ".green + json.Plot.blue);
	console.log("Actors: ".green + json.Actors.blue);
	console.log(colors.rainbow("-------------------------------------------------------------------"));
  }
});

}
// function doIt(){

// }
