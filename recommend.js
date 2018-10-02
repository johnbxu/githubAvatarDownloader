// imports
require('dotenv').config();
const request = require('request');
const fs = require('fs');
const args = process.argv.slice(2);
const sleep = require('sleep');

let output = {};
let outputArr = [];
let count = 0;

let maxCount;

console.log('Welcome to the GitHub repo recommender!');

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

// should list all the starred repos
function getRepoStarred(url) {
  let options = {
    url: url,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN,
    },
  };
  request(options, function(err, res, body) {
    let starredRepos = JSON.parse(body);
    count += 1;
    for (let i = 0; i < starredRepos.length; i++) {
      if (!output[starredRepos[i].full_name]) {
        output[starredRepos[i].full_name] = 1;
      } else {
        output[starredRepos[i].full_name] += 1;
      };
    }
    if (count === starredRepos.length) {
      // console.log(output);
      pickTopFive(output);

    }
  });
}

// function recommend(repoOwner, repoName) {
getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Errors:", err);

  let starred = [];
  for (contributor of result) {
    starred.push(contributor.starred_url);
  }
  for (url of starred) {
    let newURL = url.replace('{/repo}', '').replace('{/owner}', '');
    getRepoStarred(newURL);
  }
});

// pick top 5
function pickTopFive (obj) {
  for (const key in obj) {
    outputArr.push([key, obj[key]]);
  }
  const sorted = outputArr.sort((a,b) => {
    return b[1] - a[1];
  });
  for (let i = 0; i < 5; i += 1) {
    console.log(outputArr[i]);
  }
}
