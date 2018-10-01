let request = require('request');
let token = require('./secrets.js');
let fs = require('fs');

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

  for (contributor of result) {
    downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}`)
  }
});

function downloadImageByURL(url, filePath) {
  let options = {
    url: `${url}`,
    // url: `https://github.com/lighthouse-labs/promises-exercises`,
    headers: {
      'User-Agent': 'request',
      'Authentication': token,

    },
  };
  request.get(options.url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      console.log('response status code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath));
}

