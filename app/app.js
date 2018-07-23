'use strict';

const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');

var userData;

function init() {
    let options = {
        url: 'https://api.github.com/users/GCastorAzevedo',
        headers: {
            'User-Agent': 'request',
        }
    };

    return new Promise(function(resolve, reject){
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

function main() {
    let promiseInit = init();
    promiseInit.then(function(result) {
        userData = result;
        console.log("My github data: ")
        console.log(userData)
    }, function(err) {
        console.log(err);
    });
}

main();