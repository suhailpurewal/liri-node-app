var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require ("node-spotify-api");
var request = require("request");
var spotify = new Spotify({
  id: "5decabcbeac1417d8efc4515a8b7d8c5",
  secret: "b9b7dcbe12934b7ca3715fa1c5055e20",
});
var twitterKeys = keys.twitterKeys;
var random = "./random.txt"
var log = "./log.txt"
var command = process.argv[2];
// for loop to allow for inputs longer than 1 word
var input = process.argv[3];
	for(i=4; i<process.argv.length; i++){
		input += '+' + process.argv[i];
}
// function to switch cases and then run the subsequent functions for the appropriate case
function switchCommand(){
switch (command){
	case "my-tweets":
	tweet();
	break;

	case "spotify-this-song":
	spotifysearch();
	break;

	case "movie-this":
	omdb();
	break;

	case "do-what-it-says":
	doIt();
	break;

	default:
	break;
}
};
// function to pull my dummy twitter accounts latest tweets | i don't have 15 tweets but have the params set to 15 incase i decide to suddenly tweet
function tweet(){
	var client = new twitter(keys);
	var params = {screen_name: twitterUsername, count: 15};
	// i was experimenting to see if i could get it to pull up different twitter accounts, but the API might be limited to just the one username.
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
				var trimmedTweet = 
				'-----------------------------------------------------------------------\n' +
				'Tweet Number: ' + (i+1) + '\n' + 
				data[i].created_at + '\n' + 
				data[i].text + '\n' +
				'-----------------------------------------------------------------------\n';
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + trimmedTweet + '\n', (err) => {
					if (err) throw err;
				});
					console.log(trimmedTweet);
			}
		}
		else if(error){
			console.log(error)
		}	
	});
}
//function to run spotify search | if no song is specified it displays a Wu-Tang song
function spotifysearch(song){
	var song = input;
	if(song === undefined){
		song = "Protect Ya Neck"
	}
	//appending search type to log.txt
	fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song\n\n', (err) => {
		if (err) throw err;
	});		
	spotify.search({ type: 'track', query: song }, function(err, data) {
  		if (!err) {
  			var songInfo = data.tracks.items;
			for (var i = 1; i < 4; i++) {
				if (songInfo[i] != undefined) {
					var spotifyResults =
					'------------------------------------------------------------------------------------------------\n' + 
					"Artist: " + songInfo[i].artists[0].name + "\r\n" +
					"Song: " + songInfo[i].name + "\r\n" +
					"Album: " + songInfo[i].album.name + "\r\n" +
					"Preview Clip URL: " + songInfo[i].preview_url + "\r\n" + 
					"-----------------------------------------------------------------------------------------------\n";
					console.log(spotifyResults);
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
//function to run a movie search | if no movie is specified, it searches Mr. Nobody
function omdb(movie){
	var movie = input;
	if(movie === undefined){
		movie = "Mr. Nobody";
	}
	var movieSearch = movie;
	//appending search type to log.txt
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
		//appending results to log.txt
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + movieResults + '\n', (err) => {
			if (err) throw err;
			});
	});
}
//function for do-what-it-says | reads random.txt file and uses that text to run a search with any params txt file is changed to
function doIt(){
	fs.readFile("random.txt", "utf8", function(error, data){
		if (!error) {
			var doItSplit = data.split(",")
			command = doItSplit[0]
			input = doItSplit[1]
			//for loop to accept inputs longer than 2 words
        	for(i=2; i<doItSplit.length; i++){
            	input = input + "+" + doItSplit[i];
        	};
        switchCommand();
		}
	if (error) {
		throw(error)
		}
	});
};
// calling function to switch the case to whatever command is input
switchCommand();



