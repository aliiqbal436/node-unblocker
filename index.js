const puppeteer = require("puppeteer");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your React app's origin
  methods: ["GET", "POST"], // Add other methods if needed
};

app.use(cors(corsOptions));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const runSpeedTest = async () => {
    const browser = await puppeteer.launch({
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
    // executablePath: "/usr/bin/chromium-browser",
  });
  const page = await browser.newPage();
  try {
    // Navigate to the specified URL
    await page.goto(`https://www.google.com/search?q=speed+test`);
    const cookiesModalSelector = "#L2AGLb";
    const modalPresent = await page
      .waitForSelector(cookiesModalSelector, {
        timeout: 5000,
        visible: true,
        clickable: true,
      })
      .then(() => true)
      .catch(() => false);
    if (modalPresent) {
      console.log("modalPresent ====", modalPresent);

      // The Google cookies accept modal is present; click the "I Agree" button
      await page.click(cookiesModalSelector);
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.remove();
        }
      }, "#KjcHPc");
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.remove();
        }
      }, "#xe7COe");
    }
    await page.waitForSelector(
      "#knowledge-verticals-internetspeedtest__test_button"
    );
    await page.click("#knowledge-verticals-internetspeedtest__test_button");
    await page.waitForSelector(
      "#knowledge-verticals-internetspeedtest__upload"
    );
    await page.waitForTimeout(50000);

    const html = await page.content();
    await browser.close();
    io.emit("testResult", html);
  } catch (error) {
    console.log("error.message ====", error.message);
  }
}


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("runTest", () => {
    // Broadcast the message to all connected clients
    runSpeedTest()
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Handle the search request and navigate to the specified URL
// app.get("/speed-test", async (_req, res) => {
//   // Launch Chromium

// });
httpServer.listen(3007);
