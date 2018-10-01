// imports
require('dotenv').config();
const request = require('request');
const fs = require('fs');
const args = process.argv.slice(2);



// exists process if not 2 arguments
if (args.length !== 2) {
  console.log("please pass 2 arguments");
  process.exit();
}

console.log('Welcome to the GitHub Avatar Downloader!');

// function to get list of contributors; calls callback function with an array of objects
function getRepoContributors(repoOwner, repoName, cb) {
  let options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN,
    },
  };
  request(options, function(err, res, body) {
    let parsedList = JSON.parse(body);
    console.log(parsedList);
    cb(err, parsedList);
  });
}

// function to get images using an URL
function downloadImageByURL(url, filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('this path for saving the files does not exist');
    process.exit();
  }
  let options = {
    url: `${url}`,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN,
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

// function to call and download all images
getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Errors:", err);
  for (contributor of result) {
    downloadImageByURL(contributor.avatar_url, `avatars/test/${contributor.login}`)
  }
});
