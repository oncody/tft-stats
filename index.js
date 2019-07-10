const request = require('request');

const url = 'https://leagueoflegends.fandom.com/wiki/Teamfight_Tactics:Champions#Stat%20List';

request('http://www.google.com', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});