const puppeteer = require("puppeteer");
const express = require("express");

const app = express();

// Handle the search request and navigate to the specified URL
app.get("/", async (_req, res) => {
 
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

app.listen(3007);
