const fetch = require("node-fetch");

const BASE_URL = "https://api-avis-situation-sirene.insee.fr";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

// Fetch avec retry (maxRetries = 3)
async function fetchWithRetry(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Tentative ${attempt} échouée: ${error.message}`);
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, delay * attempt)); // délai exponentiel
    } else {
      throw new Error(`Échec après ${maxRetries} tentatives: ${error.message}`);
    }
  }
}

async function resolveQuery(query) {
  const url = `${BASE_URL}/identification/siret/${query}?telephone=`;
  const data = await fetchWithRetry(url);

  const unite = data.uniteLegale;
  const periode = unite.periodesUniteLegale?.[0] || {};

  return {
    siren_number: unite.siren,
    siret_number: query,
    nom_entreprise: periode.denominationUniteLegale || "Non renseigné",
  };
}

async function scraper(siret) {
  return await resolveQuery(siret);
}

module.exports = { scraper };
