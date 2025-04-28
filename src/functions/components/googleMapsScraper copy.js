// Import the necessary libraries
const proxyChain = require("proxy-chain"); // For anonymizing the proxy
const puppeteer = require("puppeteer-extra"); // Enhanced version of Puppeteer for additional functionality

// Import and use stealth plugin to prevent detection of the browser automation
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Define the proxy settings
// const proxy = "http://username:password@proxy-host:proxy-port";
const proxy =
  "http://brd-customer-hl_020d4d81-zone-datacenter_proxy1-ip-158.46.166.29:b2f0p7qjizag@brd.superproxy.io:33335";
// The main async function where the browser automation takes place
async function Scraper(name, location) {
  // Anonymize the proxy to prevent detection
  const newProxyUrl = await proxyChain.anonymizeProxy(proxy);
  console.log(newProxyUrl); // Print the new anonymized proxy URL

  // Launch the browser with specified options
  const browser = await puppeteer.launch({
    headless: true, // Run browser in headless mode (no UI)
    // args: [`--proxy-server=${newProxyUrl}`], // Use the anonymized proxy
  });

  // Create a new page in the browser
  const page = await browser.newPage();
  // Navigate to Google Maps and search for the keyword
  let searchUrl = "https://www.google.com/maps/search/";
  if (name && location)
    searchUrl += `${encodeURIComponent(name)}+${encodeURIComponent(location)}/`;
  else if (name) searchUrl += `${encodeURIComponent(name)}/`;
  else if (location) searchUrl += `${encodeURIComponent(location)}/`;

  await page.goto(searchUrl);

  // Try to find and click the accept cookies button, if it appears
  try {
    const acceptCookiesSelector = "form:nth-child(2)";
    await page.waitForSelector(acceptCookiesSelector, { timeout: 5000 });
    await page.click(acceptCookiesSelector);
  } catch (error) {
    // If the selector is not found or times out, catch the error and continue
  }

  // Scroll through the search results on Google Maps to load all items
  await page.evaluate(async () => {
    const searchResultsSelector = 'div[role="feed"]';
    const wrapper = document.querySelector(searchResultsSelector);

    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 1000; // How much to scroll each time
      var scrollDelay = 3000; // Wait time between scrolls

      var timer = setInterval(async () => {
        var scrollHeightBefore = wrapper.scrollHeight;
        wrapper.scrollBy(0, distance);
        totalHeight += distance;

        // If we've scrolled to the bottom, wait, then check if more content loaded
        if (totalHeight >= scrollHeightBefore) {
          totalHeight = 0;
          await new Promise((resolve) => setTimeout(resolve, scrollDelay));

          var scrollHeightAfter = wrapper.scrollHeight;

          // If no new content, stop scrolling and finish
          if (scrollHeightAfter > scrollHeightBefore) {
            return;
          } else {
            clearInterval(timer);
            resolve();
          }
        }
      }, 200); // Interval time between each scroll
    });
  });

  // Extract data from the loaded search results
  const results = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll('div[role="feed"] > div > div[jsaction]')
    );

    return items.map((item) => {
      let data = {};

      // Extract the title, link, and website from each search result, handling errors gracefully
      try {
        data.title = item.querySelector(".fontHeadlineSmall").textContent;
      } catch (error) {}

      try {
        data.link = item.querySelector("a").getAttribute("href");
      } catch (error) {}

      try {
        // Extract the website link from the search result
        // Select all anchor tags that start with 'http'
        // and filter out Google-related links
        const anchors = item.querySelectorAll("a[href^='http']");
        for (let anchor of anchors) {
          const href = anchor.getAttribute("href");
          if (
            !href.includes("google") &&
            !href.includes("/maps/") &&
            !href.includes("/search")
          ) {
            data.website = href;
            break;
          }
        }
      } catch (error) {}

      // Extract the rating and number of reviews
      try {
        const ratingText = item
          .querySelector('.fontBodyMedium > span[role="img"]')
          .getAttribute("aria-label")
          .split(" ")
          .map((x) => x.replace(",", "."))
          .map(parseFloat)
          .filter((x) => !isNaN(x));

        data.stars = ratingText[0];
        data.reviews = ratingText[1];
      } catch (error) {}

      // Extract phone numbers from the text, using regex to match formats
      try {
        const textContent = item.innerText;
        const phoneRegex =
          /((\+?\d{1,2}[ -]?)?(\(?\d{3}\)?[ -]?\d{3,4}[ -]?\d{4}|\(?\d{2,3}\)?[ -]?\d{2,3}[ -]?\d{2,3}[ -]?\d{2,3}))/g;

        const matches = [...textContent.matchAll(phoneRegex)];
        let phoneNumbers = matches
          .map((match) => match[0])
          .filter((phone) => (phone.match(/\d/g) || []).length >= 10);

        let phoneNumber =
          phoneNumbers.length > 0
            ? phoneNumbers[0]
            : item
                .querySelector(".fontBodyMedium")
                .innerText.match(phoneRegex)[0]
            ? item
                .querySelector(".fontBodyMedium")
                .innerText.match(phoneRegex)[0]
            : null;
        if (phoneNumber) {
          phoneNumber = phoneNumber.replace(/[ -]/g, "");
        }

        data.phone = phoneNumber;
      } catch (error) {}

      return data; // Return the extracted data for each item
    });
  });

  // Filter out results without titles and write them to a file
  const filteredResults = results.filter((result) => result.title);

  await browser.close(); // Close the browser
  return filteredResults; // Return the filtered results
}

// Google maps enricher
async function Enricher(name, location) {
  // Anonymize the proxy to prevent detection
  const newProxyUrl = await proxyChain.anonymizeProxy(proxy);
  console.log(newProxyUrl); // Print the new anonymized proxy URL

  // Launch the browser with specified options
  const browser = await puppeteer.launch({
    headless: true, // Run browser in headless mode (no UI)
    // args: [`--proxy-server=${newProxyUrl}`], // Use the anonymized proxy
  });

  // Create a new page in the browser
  const page = await browser.newPage();
  // Navigate to Google Maps and search for the keyword
  let searchUrl = "https://www.google.com/maps/search/";
  if (name && location)
    searchUrl += `${encodeURIComponent(name)}+${encodeURIComponent(location)}/`;
  else if (name) searchUrl += `${encodeURIComponent(name)}/`;
  else if (location) searchUrl += `${encodeURIComponent(location)}/`;

  await page.goto(searchUrl);

  // Try to find and click the accept cookies button, if it appears
  try {
    const acceptCookiesSelector = "form:nth-child(2)";
    await page.waitForSelector(acceptCookiesSelector, { timeout: 5000 });
    await page.click(acceptCookiesSelector);

    console.log("Clicked accept cookies", acceptCookiesSelector);
  } catch (error) {
    // If the selector is not found or times out, catch the error and continue
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Extract data from the loaded search results
  const result = await page.evaluate(() => {
    let data = {};

    // Business name
    try {
      data.title = document.querySelector("div > h1").textContent.trim();
    } catch (error) {}

    // Business type
    try {
      data.type = document
        .querySelector("div[class=fontBodyMedium]>span>span>button")
        .textContent.trim();
    } catch (error) {}

    // Extract phone numbers from the text, using regex to match formats
    try {
      const phoneRegex =
        /((\+?\d{1,2}[ -]?)?(\(?\d{3}\)?[ -]?\d{3,4}[ -]?\d{4}|\(?\d{2,3}\)?[ -]?\d{2,3}[ -]?\d{2,3}[ -]?\d{2,3}))/g;

      const divs = document.querySelectorAll("button > div > div > div");

      let phoneNumber = null;

      for (const div of divs) {
        const text = div.textContent.trim();
        const matches = text.match(phoneRegex);

        if (matches && matches.length > 0) {
          phoneNumber = matches[0].replace(/[ -]/g, "");
          break; // dès qu'on en trouve un, on arrête
        }
      }

      data.phone = phoneNumber;
    } catch (error) {}

    // Business address
    try {
      data.address = item
        .querySelector('button[data-item-id="address"]>div>div>div')
        .textContent.trim();
    } catch (error) {}

    // Extract business code plus
    try {
      data.codePlus = document
        .querySelector('button[data-item-id="oloc"]>div>div>div')
        .textContent.trim();
    } catch (error) {}

    // Business website
    try {
      const websiteRegex = /\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/;

      const text = document
        .querySelector('a[data-item-id="authority"] > div > div > div')
        .textContent.trim();

      const website =
        document.querySelector("a").getAttribute("href") ??
        text.match(websiteRegex)[0];
      data.website = website;
    } catch (error) {}

    try {
      // Première sélection pour ratingCount
      const mainSpans = document.querySelectorAll(
        `div[role="main"] > div > div > div > div > div > div > div > span`
      );

      for (const span of mainSpans) {
        const text = span.textContent.trim();
        if (text && text.length > 0) {
          const match = text.match(/\d+/g);
          if (match) {
            data.ratingCount = parseInt(match[0], 10);
            break; // Dès qu'on trouve un, on sort
          }
        }
      }

      // Deuxième sélection pour secondaryCount
      const nestedSpans = document.querySelectorAll(
        `div[role="main"] > div > div > div > div > div > div > div > span > span > span`
      );

      for (const span of nestedSpans) {
        const text = span.textContent.trim();
        if (text && text.length > 0) {
          const match = text.match(/\d+/g);
          if (match) {
            data.totalReview = parseInt(match[0], 10);
            break; // Dès qu'on trouve un, on sort
          }
        }
      }
    } catch (error) {}

    // Business image URL
    try {
      data.imageUrl = document
        .querySelector('div >button>img[decoding="async"]')
        .getAttribute("src");
    } catch (error) {}
    return data; // Return the extracted data for each item
  });

  await browser.close(); // Close the browser
  return result; // Return the filtered results
}

const Google = { Scraper, Enricher };
module.exports = Google;
