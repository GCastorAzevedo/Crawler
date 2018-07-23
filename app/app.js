const agent = require('../agents.crawl');

// initializes all subscribed crawler agents
Object.keys(agent).forEach( (domain) => {
    let crawler = agent[domain].crawler;
    let params = agent[domain].params;
    crawler(...params);
});