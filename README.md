# hakrawler.js



A JavaScript-based web crawling tool inspired by [hakrawler](https://github.com/hakluke/hakrawler). This tool crawls web pages, extracts URLs, JavaScript files, and form actions, and supports advanced options such as proxy support, timeout, and subdomain crawling.

---

Dependency:
```bash
   npm install axios cheerio https-proxy-agent minimist
   ```


## Features

- **Single and Multiple URL Crawling**: Input URLs via stdin.
- **Extract Links, JavaScript Files, and Form Actions**: Scrape all `<a>`, `<script>`, and `<form>` elements.
- **Timeout**: Set a maximum time for crawling each URL.
- **Proxy Support**: Route requests through a proxy.
- **Subdomain Crawling**: Optionally include subdomains in the crawl.
- **Depth Control**: Limit the crawling depth.
- **Duplicate Filtering**: Avoid revisiting the same URLs.

---

## Installation

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn

### Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/securi3ytalent/jsRawler
   cd jsRawler
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage

Save the script as `jsRawler.js` in your project folder and run the following commands:

### 1. Single URL
```bash
echo https://google.com | node jsRawler.js
```

### 2. Multiple URLs
```bash
cat urls.txt | node jsRawler.js
```

### 3. Timeout for Each Line
Set a timeout of 5 seconds for each request:
```bash
cat urls.txt | node jsRawler.js --timeout 5
```

### 4. Use Proxy
Send all requests through a proxy:
```bash
cat urls.txt | node jsRawler.js --proxy http://localhost:8080
```

### 5. Include Subdomains
Crawl subdomains as well:
```bash
echo https://google.com | node jsRawler.js --subs
```

---

## Options

| Flag               | Description                                                                 | Example                              |
|--------------------|-----------------------------------------------------------------------------|--------------------------------------|
| `--timeout`        | Set the maximum crawling time (in seconds) per URL.                        | `--timeout 5`                        |
| `--proxy`          | Route all requests through a specified proxy.                              | `--proxy http://localhost:8080`      |
| `--subs`           | Include subdomains in the crawling scope.                                  | `--subs`                             |
| `--d`              | Set the maximum crawling depth.                                            | `--d 3`                              |

---

## Example Tool Chain

```bash
echo google.com | haktrails subdomains | httpx | node jsRawler.js
```

### Breakdown:
1. **`haktrails subdomains`**: Extract subdomains of `google.com`.
2. **`httpx`**: Filter subdomains that respond to HTTP(S).
3. **`jsRawler.js`**: Crawl those subdomains for links, scripts, and forms.

---

## Notes

- This tool requires input from `stdin`. Make sure to pipe URLs into it.
- If no URLs are detected, the tool will display a warning.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

