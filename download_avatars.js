var request = require('request');
var token = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  let options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    // url: `https://github.com/lighthouse-labs/promises-exercises`,
    headers: {
      'User-Agent': 'request',
      'Authentication': token,

    },
  };

  request(options, function(err, res, body) {
    let parsedList = JSON.parse(body);
    cb(err, parsedList);
  });



}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

