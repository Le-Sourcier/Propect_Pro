// ===== Imports =====
const proxyChain = require("proxy-chain");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// ===== Constants =====
const proxy =
    "http://brd-customer-hl_020d4d81-zone-datacenter_proxy1-ip-158.46.166.29:b2f0p7qjizag@brd.superproxy.io:33335";
const baseUrl = "https://www.google.com/maps/search/";
const acceptCookiesSelector = "form:nth-child(2)";

// ===== Utilities =====
async function launchBrowser() {
    const newProxyUrl = await proxyChain.anonymizeProxy(proxy);
    console.log("Using proxy:", newProxyUrl);
    return puppeteer.launch({
        headless: true,
        // args: [`--proxy-server=${newProxyUrl}`], // Uncomment to use proxy
    });
}

async function buildSearchUrl(name, location) {
    let url = baseUrl;
    if (name && location)
        url += `${encodeURIComponent(name)}+${encodeURIComponent(location)}/`;
    else if (name) url += `${encodeURIComponent(name)}/`;
    else if (location) url += `${encodeURIComponent(location)}/`;
    return url;
}

async function acceptCookies(page) {
    try {
        await page.waitForSelector(acceptCookiesSelector, { timeout: 5000 });
        await page.click(acceptCookiesSelector);
    } catch (error) {
        // Ignore if not found
    }
}

async function scrollPage(page) {
    await page.evaluate(async () => {
        const feed = document.querySelector('div[role="feed"]');
        if (!feed) return;

        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 1000;
            const scrollDelay = 3000;

            const timer = setInterval(async () => {
                const heightBefore = feed.scrollHeight;
                feed.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= heightBefore) {
                    totalHeight = 0;
                    await new Promise((res) => setTimeout(res, scrollDelay));
                    const heightAfter = feed.scrollHeight;

                    if (heightAfter === heightBefore) {
                        clearInterval(timer);
                        resolve();
                    }
                }
            }, 200);
        });
    });
}

// ===== Scraper Function =====
// async function Scraper(name, location, limite) {
//     const browser = await launchBrowser();
//     const page = await browser.newPage();
//     const searchUrl = await buildSearchUrl(name, location);

//     await page.goto(searchUrl);
//     await acceptCookies(page);
//     await scrollPage(page);

//     const results = await page.evaluate(() => {
//         const items = Array.from(
//             document.querySelectorAll('div[role="feed"] > div > div[jsaction]')
//         );

//         return items.map((item) => {
//             let data = {};

//             // Extract the title, link, and website from each search result, handling errors gracefully
//             try {
//                 data.nom_entreprise =
//                     item.querySelector(".fontHeadlineSmall").textContent;
//             } catch (error) {}

//             try {
//                 data.link = item.querySelector("a").getAttribute("href");
//             } catch (error) {}

//             try {
//                 // Extract the website link from the search result
//                 // Select all anchor tags that start with 'http'
//                 // and filter out Google-related links
//                 const anchors = item.querySelectorAll("a[href^='http']");
//                 for (let anchor of anchors) {
//                     const href = anchor.getAttribute("href");
//                     if (
//                         !href.includes("google") &&
//                         !href.includes("/maps/") &&
//                         !href.includes("/search")
//                     ) {
//                         data.website = href;
//                         break;
//                     }
//                 }
//             } catch (error) {}

//             // Extract the rating and number of reviews
//             try {
//                 const ratingText = item
//                     .querySelector('.fontBodyMedium > span[role="img"]')
//                     .getAttribute("aria-label")
//                     .split(" ")
//                     .map((x) => x.replace(",", "."))
//                     .map(parseFloat)
//                     .filter((x) => !isNaN(x));

//                 data.stars = ratingText[0];
//                 data.reviews = ratingText[1];
//             } catch (error) {}

//             // Extract phone numbers from the text, using regex to match formats
//             try {
//                 const textContent = item.innerText;
//                 const phoneRegex =
//                     /((\+?\d{1,2}[ -]?)?(\(?\d{3}\)?[ -]?\d{3,4}[ -]?\d{4}|\(?\d{2,3}\)?[ -]?\d{2,3}[ -]?\d{2,3}[ -]?\d{2,3}))/g;

//                 const matches = [...textContent.matchAll(phoneRegex)];
//                 let phoneNumbers = matches
//                     .map((match) => match[0])
//                     .filter((phone) => (phone.match(/\d/g) || []).length >= 10);

//                 let phoneNumber =
//                     phoneNumbers.length > 0
//                         ? phoneNumbers[0]
//                         : item
//                               .querySelector(".fontBodyMedium")
//                               .innerText.match(phoneRegex)[0]
//                         ? item
//                               .querySelector(".fontBodyMedium")
//                               .innerText.match(phoneRegex)[0]
//                         : null;
//                 if (phoneNumber) {
//                     phoneNumber = phoneNumber.replace(/[ -]/g, "");
//                 }

//                 data.phone_number = phoneNumber;
//             } catch (error) {}

//             return data; // Return the extracted data for each item
//         });
//     });

//     await browser.close();
//     return results.filter((r) => r.nom_entreprise);
// }

async function Scraper(name, location, limite = 0) {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const searchUrl = await buildSearchUrl(name, location);

    await page.goto(searchUrl);
    await acceptCookies(page);
    await scrollPage(page);

    const results = await page.evaluate((lim) => {
        const items = Array.from(
            document.querySelectorAll('div[role="feed"] > div > div[jsaction]')
        );

        // Limiter le nombre d’éléments si lim est défini (> 0)
        const limitedItems = lim > 0 ? items.slice(0, lim) : items;

        return limitedItems.map((item) => {
            let data = {};

            try {
                data.nom_entreprise =
                    item.querySelector(".fontHeadlineSmall").textContent;
            } catch {}

            try {
                data.link = item.querySelector("a").getAttribute("href");
            } catch {}

            try {
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
            } catch {}

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
            } catch {}

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

                data.phone_number = phoneNumber;
            } catch {}

            return data;
        });
    }, limite);

    await browser.close();
    return results.filter((r) => r.nom_entreprise);
}

// ===== Enricher Function =====
async function Enricher(name, location) {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const searchUrl = await buildSearchUrl(name, location);

    await page.goto(searchUrl);
    await acceptCookies(page);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await page.evaluate(() => {
        const data = {};
        const phoneRegex =
            /((\+?\d{1,2}[ -]?)?(\(?\d{2,4}\)?[ -]?\d{2,4}[ -]?\d{2,4}[ -]?\d{2,4}))/g;

        try {
            data.nom_entreprise =
                document.querySelector("div > h1")?.textContent.trim() || null;
        } catch {}
        try {
            data.type =
                document
                    .querySelector("div[class=fontBodyMedium]>span>span>button")
                    ?.textContent.trim() || null;
        } catch {}

        try {
            const divs = document.querySelectorAll("button > div > div > div");
            for (const div of divs) {
                const matches = div.textContent.trim().match(phoneRegex);
                if (matches?.length) {
                    data.phone_number = matches[0].replace(/[ -]/g, "");
                    break;
                }
            }
        } catch {}

        try {
            data.address =
                document
                    .querySelector('button[data-item-id="address"]>div>div>div')
                    ?.textContent.trim() || null;
        } catch {}

        try {
            data.codePlus =
                document
                    .querySelector('button[data-item-id="oloc"]>div>div>div')
                    ?.textContent.trim() || null;
        } catch {}

        try {
            const authority = document
                .querySelector('a[data-item-id="authority"]')
                .getAttribute("href");
            const website = authority || document.querySelector("a")?.href;

            if (
                !website.includes("google") &&
                !website.includes("/maps/") &&
                !website.includes("/search")
            ) {
                data.website = website || null;
                // break;
            }
        } catch {}

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
                        data.stars = parseInt(match[0], 10);
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
                        data.reviews = parseInt(match[0], 10);
                        break; // Dès qu'on trouve un, on sort
                    }
                }
            }
        } catch (error) {}

        return data;
    });

    await browser.close();
    return result;
}

// ===== Export Functions (if needed) =====
module.exports = { Scraper, Enricher };

// (async () => {
//     const results = await Scraper("restaurant", "Paris");
//     console.log(results);
//     const enrichedResults = await Scraper("restaurant", "Paris");
//     console.log(enrichedResults);
// })();
