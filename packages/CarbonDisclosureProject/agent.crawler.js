let url = "https://www.cdp.net/en/responses";
let query = [
    "queries[name]=South+Africa",
    "per_page=20",
    "sort_by=project_year",
    "sort_dir=desc"
];
let pages = 4;
let filename = "./data/cdp_data/south_africa.array";

module.exports = [url, query, pages, filename];