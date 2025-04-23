const puppeteer = require("puppeteer");

module.exports = async function YellowScraper(name, location) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = `https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=${encodeURIComponent(
    name
  )}&ou=${encodeURIComponent(location)}`;

  console.log("Navigating to:", url);
  await page.goto(url, { waitUntil: "networkidle0" }); // Attendre que le réseau soit inactif

  // Augmenter le délai d'attente pour que Puppeteer puisse trouver l'élément
  try {
    await page.waitForSelector(".bi-list", { timeout: 60000 }); // Attendre jusqu'à 60 secondes
  } catch (error) {
    console.error("Sélecteur .bi-list non trouvé dans le temps imparti");
    await browser.close();
    return;
  }

  // Scraper les données de chaque élément <li> de la liste
  const data = await page.evaluate(() => {
    const items = document.querySelectorAll("li.bi.bi-generic");
    const results = [];

    items.forEach((item) => {
      const name = item.querySelector("h3")
        ? item.querySelector("h3").innerText
        : null;
      const address = item.querySelector(".bi-address")
        ? item.querySelector(".bi-address").innerText.trim()
        : null;
      const phone = item.querySelector(
        ".bi-fantomas .number-contact .annonceur"
      )
        ? item
            .querySelector(".bi-fantomas .number-contact .annonceur")
            .innerText.trim()
        : null;
      const description = item.querySelector(".bi-description")
        ? item.querySelector(".bi-description").innerText.trim()
        : null;

      // Extraire les tags associés
      const tags = [];
      const tagElements = item.querySelectorAll(".bi-tags-list .bi-tag");
      tagElements.forEach((tag) => tags.push(tag.innerText));

      // Ajouter à la liste des résultats
      results.push({
        name,
        address,
        phone,
        description,
        tags,
      });
    });

    return results;
  });

  await browser.close();
  return data; // Retourner les résultats
};
