const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const tableParser = require('cheerio-tableparser');

function buildURL(url, query) {
    let url_query = query.join("&");
    url = url.concat("?");
    url = url.concat(url_query);
    return url;
}

function generatePromisesList(url, pages) {
    let promises = [];
    let initialData = [];
    promises[0] = () => { return Promise.resolve(initialData); }

    for (page = 1; page < pages+1; page++) {
        let options = {
            url: url.concat(`&page=${page}`),
            headers: {
                'User-Agent': 'request',
            },
        };
        promises[page] = (data) => { return new Promise(function(resolve, reject) {
            console.log(data.length);
            if (page == 3) {
                console.log(JSON.stringify(data))
            }
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

    return promises
}

function loadHTML(url, query, pages, filename) {

    url = buildURL(url, query);

    let promises = generatePromisesList(url, pages)

    let p = Promise.resolve();

    let promisesChain = (list) => {
        let initialPromise = Promise.resolve([]);
        return list.reduce(function(prev, next) {
            return prev = prev.then(next);
        }, p);
    }
    promisesChain(promises);
}

function errHandler(err) {
    console.log(err);
}

function tableHandler(html) {
    let $ = cheerio.load(html);
    tableParser($);
    let data = $('table','.search_results__table').parsetable();
    return data;
}

function htmlHandler(html, data) {
    let $ = cheerio.load(html);
    $('tr').each( (i, tr) => {
        let row = [];
        $('th', tr).each( (i, th) => {
            text =  $(th).text();
            text = text.replace(/\n/g, "");
            row[i] = text;
        });
        $('td', tr).each( (i, td) => {
            text = $(td).text()
            text = text.replace(/\n\n\n\n\n\n\n/g,",")
            text = text.replace(/\n/g, "")
            row[i] = text;
        });
        data.push(row);
    })
    return data
}

function dataHandler(data, filename) {
    fs.writeFile(filename, JSON.stringify(data), 'utf-8', errHandler);
}

let url = "https://www.cdp.net/en/responses";
let query = [
    "queries[name]=South+Africa",
    "per_page=20",
    "sort_by=project_year",
    "sort_dir=desc"
];
let pages = 4;
let filename = "./data/cdp_data/south_africa.array";

loadHTML(url, query, pages, filename)