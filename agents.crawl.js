const CDPParams = require('./packages/CarbonDisclosureProject/agent.crawler');
const crawler = require('./packages/CarbonDisclosureProject/CarbonDisclosureProject');

// agents contains all crawler subscriptions. Each agent has a crawler function together with its parameters
const agents = {
    "CarbonDisclosureProject": {
        params: CDPParams,
        crawler: crawler,
    }
}

module.exports = agents;
