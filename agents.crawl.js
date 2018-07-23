const CDPParams = require('./packages/CarbonDisclosureProject/agent.crawler');
const crawler = require('./packages/CarbonDisclosureProject/CarbonDisclosureProject');

module.exports = {
    "CarbonDisclosureProject": {
        params: CDPParams,
        crawler: crawler,
    }
}