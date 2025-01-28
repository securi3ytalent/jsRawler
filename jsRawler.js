const axios = require("axios");
const cheerio = require("cheerio");
const readline = require("readline");
const https = require("https");
const { URL } = require("url");
const { HttpsAgent } = require("https-proxy-agent");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));

if (args.h || args.help) {
  console.log(`

  Author: @SecurityTalent
  join_us: https://t.me/Securi3yTalent

Usage: node jsRawler.js [options]

Options:
  -h, --help        Show help message
  --timeout <n>     Set the maximum crawling time (in seconds) per URL
  --proxy <url>     Route all requests through a specified proxy
  --subs            Include subdomains in the crawling scope
  --d <n>           Set the maximum crawling depth

Examples:
  echo https://google.com | node jsRawler.js
  cat urls.txt | node jsRawler.js --timeout 5
  cat urls.txt | node jsRawler.js --proxy http://localhost:8080
`);
  process.exit(0);
}

// Configuration from arguments
const timeout = args.timeout ? parseInt(args.timeout) * 1000 : 10000; // Timeout in ms
const proxy = args.proxy || null; // Proxy URL
const includeSubdomains = args.subs || false; // Include subdomains
const maxDepth = args.d || 2; // Maximum crawling depth

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const visitedUrls = new Set();

// Fetch page with optional proxy and timeout
async function fetchPage(url) {
  try {
    const options = {
      timeout,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Disable TLS verification
    };
    if (proxy) {
      const proxyAgent = new HttpsAgent({ proxy });
      options.httpsAgent = proxyAgent;
    }
    const response = await axios.get(url, options);
    return response.data;
  } catch (err) {
    console.error(`[Error] Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

// Crawl a URL
async function crawl(url, depth = 0) {
  if (depth > maxDepth || visitedUrls.has(url)) {
    console.log(`[Skipping] ${url} - max depth reached or already visited.`);
    return;
  }
  visitedUrls.add(url);

  console.log(`[Crawling] ${url}`);
  const html = await fetchPage(url);
  if (!html) return;

  const $ = cheerio.load(html);

  // Find links
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const absUrl = new URL(href, url).href;

    if (!includeSubdomains && new URL(absUrl).hostname !== new URL(url).hostname) return;

    console.log(`[Link] ${absUrl}`);
    crawl(absUrl, depth + 1); // Recursive crawling
  });

  // Find JavaScript files
  $("script[src]").each((_, el) => {
    const src = $(el).attr("src");
    const absUrl = new URL(src, url).href;
    console.log(`[JavaScript] ${absUrl}`);
  });

  // Find form actions
  $("form[action]").each((_, el) => {
    const action = $(el).attr("action");
    const absUrl = new URL(action, url).href;
    console.log(`[Form Action] ${absUrl}`);
  });
}

// Read URLs from stdin and start crawling
rl.on("line", (line) => {
  const url = line.trim();
  if (url) crawl(url);
});
