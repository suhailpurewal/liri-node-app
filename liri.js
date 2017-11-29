var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require ("node-spotify-api");
var spotify = new Spotify({
  id: "5decabcbeac1417d8efc4515a8b7d8c5",
  secret: "b9b7dcbe12934b7ca3715fa1c5055e20",
});
var request = require("request");
var colors = require("colors");
var twitterKeys = keys.twitterKeys;
var random = "./random.txt"
var log = "./log.txt"
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
	spotifysearch();
	break;

	case "movie-this":
	console.log("in movie state")
	omdb();
	break;

	case "do-what-it-says":
	console.log("in random state")
	doIt();
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
			fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
			if (err) throw err;
			});		
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if(!error){
				for (i=0; i<data.length; i++){
					var trimmedTweet = ('Number: ' + (i+1) + '\n' + data[i].created_at + '\n' + data[i].text.red + '\n');
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + trimmedTweet + '\n', (err) => {
				if (err) throw err;
				});
					console.log(trimmedTweet);
					console.log("------------------------------------------------------")
				}
			}
			
			
			else if(error){
				console.log(error)
		}	
		});
	}
function spotifysearch(song){
	var song = input;
	if(song === undefined){
		song = "Protect Ya Neck"
	}
		fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song\n\n', (err) => {
		if (err) throw err;
		});		
	spotify.search({ type: 'track', query: song }, function(err, data) {
  if (!err) {
  	var songInfo = data.tracks.items;
				for (var i = 0; i < 3; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Album: " + songInfo[i].album.name + "\r\n" +
						"Preview Clip URL: " + songInfo[i].preview_url + "\r\n" + 
						i + "-----------------------------------------------------------------------------------------------" + "\r\n";
						console.log(spotifyResults.blue);
						fs.appendFile('./log.txt', 'LIRI Response:\n\n' + spotifyResults + '\n', (err) => {
						if (err) throw err;
						});
					}
				 else {
					console.log("Song not found! - Try Again!")
					break;
				}
			}
    
  } else {
  	return console.log('Error occurred: ' + err);
  }
 
});

}
function omdb(movie){
	var movie = input;
	if(movie === undefined){
	movie = "Mr. Nobody";
	}
	var movieSearch = movie;
	fs.appendFile('./log.txt', 'User Command: node liri.js movie-this\n\n', (err) => {
	if (err) throw err;
	});		
	request("http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=full&tomatoes=true&apikey=trilogy", function(error, response, body) {
  if (!error && response.statusCode === 200) {
  	json = JSON.parse(body)
  	var movieResults = 
    "-------------------------------------------------------------------" + "\r\n" +
 	"Title: " + json.Title + "\r\n" +
	"Year: " + json.Year + "\r\n" +
	"IMDB Rating: " + json.imdbRating + "\r\n" +
	"Rotten Tomatoes Rating: " + json.Ratings[2].Value + "\r\n" +
	"Language: " + json.Language + "\r\n" +
	"Plot: " + json.Plot + "\r\n" +
	"Actors: " + json.Actors + "\r\n" +
	"-------------------------------------------------------------------" + "\r\n";
	console.log(movieResults);
	}
	fs.appendFile('./log.txt', 'LIRI Response:\n\n' + movieResults + '\n', (err) => {
	if (err) throw err;
	});
});

}
function doIt(){
	fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				var doItResults = data.split(",")
				spotifysearch(doItResults[1])
				console.log("handing off to spotify")
			} else {
				console.log("Error occurred" + error);
			}
		});
	};




// i think the only thing left is to make movie & spotify look pretty & to add doIt function and also make it look pretty.
