var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  let options = {
    // url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    url: `https://github.com/lighthouse-labs/promises-exercises`,
    headers: {
      'User-Agent': 'request',

    },
  };

  request(options.url, function(err, res, body) {
    cb(err, body);
  });



}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});