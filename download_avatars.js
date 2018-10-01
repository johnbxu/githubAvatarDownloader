let request = require('request');
let token = require('./secrets.js');
let fs = require('fs');
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log("please pass 2 arguments");
  process.exit();
}

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
    console.log(parsedList);
    cb(err, parsedList);
  });
}

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

getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Errors:", err);

  for (contributor of result) {
    downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}`)
  }
});
