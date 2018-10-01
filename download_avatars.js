// imports
require('dotenv').config();
const request = require('request');
const fs = require('fs');
const args = process.argv.slice(2);


// checks if .env file exists
if (!fs.existsSync('./.env')) {
  console.log('.env file does not exist. Exiting...');
  process.exit();
}

// checks if token exists in .env
fs.readFile('./.env', function (err, data) {
  if (err) throw err;
  if(data.indexOf('GITHUB_TOKEN') === -1){
    console.log('missing authorization token');
    process.exit();
  }
});

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
  // if Repo or Owner doesn't exist, result will contain an error message. In this case, exit process
  if (result.message == 'Not Found') {
    console.log('Repo or Owner does not exist');
    process.exit();
  }
  // if credentials are incorrect, exists process
  if (result.message == 'Bad credentials') {
    console.log('Incorrect credentials');
    process.exit();
  }
  for (contributor of result) {
    downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}`);
  }
});
