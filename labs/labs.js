'use strict';

const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');

var userData;

function getData(url) {
    let options = {
        url: url,
        headers: {
            'User-Agent': 'request',
        },
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

const errHandler = function(err) {
    console.log(err);
}

function main() {
    let url = 'https://api.github.com/users/GCastorAzevedo';
    let dataPromise = getData(url);
    dataPromise.then(JSON.parse, errHandler)
               .then(function(result) {
                   userData = result;
                   let newPromise = getData(userData.followers_url).then(JSON.parse);
                   return newPromise;
               }, errHandler)
               .then(function(data) {
                   console.log(data);
               }, errHandler);
}

main();