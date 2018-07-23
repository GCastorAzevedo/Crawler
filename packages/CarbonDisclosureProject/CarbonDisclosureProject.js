//'use strict';

const fs = require('fs');
const console = require('console');
const cheerio = require('cheerio');
const request = require('request');
const tableParser = require('cheerio-tableparser');

function errHandler(err) {
    console.log(err);
}

function tableHandler(html) {
    let $ = cheerio.load(html);
    tableParser($);
    let data = $('table','.search_results__table').parsetable();
    return data;
}

function dataHandler(data, filename) {
    fs.writeFile(filename, JSON.stringify(data), 'utf-8', errHandler);
}

function htmlHandler(html, data) {
    let $ = cheerio.load(html);
    $('tr').each( (i, tr) => {
        let row = [];
        $('th', tr).each( (i, th) => {
            let text =  $(th).text();
            text = text.replace(/\n/g, "");
            row[i] = text;
        });
        $('td', tr).each( (i, td) => {
            let text = $(td).text()
            text = text.replace(/\n\n\n\n\n\n\n/g,",")
            text = text.replace(/\n/g, "")
            row[i] = text;
        });
        data.push(row);
    })
    return data
}

function generatePromisesList(url, pages, filename) {
    let promises = [];
    let initialData = [];
    promises[0] = () => { return Promise.resolve(initialData); }

    for (let page = 1; page < pages+1; page++) {
        let options = {
            url: url.concat(`&page=${page}`),
            headers: {
                'User-Agent': 'request',
            },
        };
        promises[page] = (data) => { return new Promise(function(resolve, reject) {
            request.get(options, function(err, resp, html) {
                if (err) {
                    reject(err);
                } else {
                    resolve(htmlHandler(html, data));
                }
            });
        }); }
    }
    promises[pages+1] = (data) => { return Promise.resolve(
        dataHandler(data, filename)
    );}

    return promises;
}

function buildURL(url, query) {
    let url_query = query.join("&");
    url = url.concat("?");
    url = url.concat(url_query);
    return url;
}

module.exports = function crawler(url, query, pages, filename) {

    url = buildURL(url, query);

    let promises = generatePromisesList(url, pages, filename)

    let p = Promise.resolve();

    let promisesChain = (list) => {
        let initialPromise = Promise.resolve([]);
        return list.reduce(function(prev, next) {
            return prev = prev.then(next);
        }, p);
    }
    promisesChain(promises);
}