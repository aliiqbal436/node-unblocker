// "use strict";

// var http = require("http");
// var Unblocker = require("unblocker");

// var unblocker = Unblocker({});

// var server = http
//   .createServer(function (req, res) {
//     // first let unblocker try to handle the requests
//     unblocker(req, res, function (err) {
//       // this callback will be fired for any request that unblocker does not serve
//       var headers = { "content-type": "text/plain" };
//       if (err) {
//         res.writeHead(500, headers);
//         return res.end(err.stack || err);
//       }
//       if (req.url == "/") {
//         res.writeHead(200, headers);
//         return res.end(
//           "Use the format http://thissite.com/proxy/http://site-i-want.com/ to access the proxy."
//         );
//       } else {
//         res.writeHead(404, headers);
//         return res.end("Error 404: file not found.");
//       }
//     });
//   })
//   .listen(8080);

// // allow unblocker to proxy websockets
// server.on("upgrade", unblocker.onUpgrade);

// console.log("proxy server live at http://localhost:8080/");

// const puppeteer = require('puppeteer');
// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/', async (req, res) => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Navigate to the speedtest.net website
//   await page.goto('https://www.speedtest.net/');

//   // Wait for the speed test to complete (adjust the selector if needed)
// //   await page.waitForSelector('.result-data .result-data-large .download-speed');

//   // Get the HTML of the speed test result
//   const html = await page.content();

//   // Send the HTML response to the client
//   res.send(html);

//   await browser.close();
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
const port = 3000;

// Handle the search request and navigate to the specified URL
app.get("/", async (req, res) => {
  const query = req.query.query;

  // Launch Chromium
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    // Navigate to the specified URL
    await page.goto(`https://www.google.com/search?q=speed+test`);
    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector(
      "#knowledge-verticals-internetspeedtest__test_button"
    );
    await page.click("#knowledge-verticals-internetspeedtest__test_button");
    await page.waitForSelector(
      "#knowledge-verticals-internetspeedtest__upload"
    );
    await page.waitForTimeout(30000);

    const html = await page.content();
    await browser.close();

    res.send(html);
  } catch (error) {
    console.log("error.message ====", error.message);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Proxy browser server is running on http://localhost:${port}`);
});
