const fetch = require("node-fetch");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const API_TOKEN = "97a405f1664a83329a7d89ebf51dc227b90633c4ba4a2575";
const BASE_URL = "https://api.pappers.fr/v2";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

// Generic fetcher with basic error handling
async function fetchPappers(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return response.json();
}

// Get company name and full_name from SIREN if necessary
async function resolveQuery(query) {
  if (isNaN(query)) return { searchQuery: query, full_name: null };

  const url = `${BASE_URL}/entreprise/cartographie?api_token=${API_TOKEN}&siren=${query}&inclure_entreprises_dirigees=true&inclure_entreprises_citees=false&inclure_sci=true&autoriser_modifications=true`;
  const data = await fetchPappers(url);

  const company = data?.entreprises?.[0]?.nom_entreprise;
  const first_name = data?.personnes?.[0]?.prenom ?? "";
  const last_name = data?.personnes?.[0]?.nom ?? "";
  const full_name = `${first_name} ${last_name}`.trim();

  console.log("Dirigeant: ", first_name);

  if (!company) throw new Error("No company found for the provided SIREN.");

  return { searchQuery: company, full_name };
}

// Fetch all paginated results
async function fetchAllResults(searchQuery) {
  const allResults = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const url = `${BASE_URL}/recherche?q=${encodeURIComponent(
      searchQuery
    )}&api_token=${API_TOKEN}&precision=standard&bases=entreprises,dirigeants,publications&page=${currentPage}&par_page=400&case_sensitive=false`;

    try {
      const data = await fetchPappers(url);

      if (!Array.isArray(data.resultats)) {
        console.warn(
          `Invalid resultats array on page ${currentPage}, skipping.`
        );
        break;
      }

      allResults.push(...data.resultats);

      if (currentPage === 1) {
        const totalResults = data.total_results ?? 0;
        totalPages = Math.ceil(totalResults / 400);
      }
    } catch (error) {
      console.warn(`Error on page ${currentPage}: ${error.message}`);
    }

    currentPage++;
  } while (currentPage <= totalPages);

  return allResults;
}

// Clean and format the output
function formatResults(results, full_name) {
  return results.map(
    ({
      nom_entreprise,
      forme_juridique,
      categorie_juridique,
      siren,
      code_naf,
      siege,
    }) => ({
      nom_entreprise,
      forme_juridique,
      categorie_juridique,
      siren,
      code_naf,
      siege,
      dirigeant: full_name,
    })
  );
}

// Public functions
async function scraper(query) {
  try {
    const { searchQuery, full_name } = await resolveQuery(query);
    const results = await fetchAllResults(searchQuery);
    return formatResults(results, full_name);
  } catch (error) {
    console.error("Scraper error:", error.message);
    return [];
  }
}

async function enrich(query) {
  return scraper(query);
}

module.exports = { scraper, enrich };

// const fetch = require("node-fetch");
// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// puppeteer.use(StealthPlugin());

// const API_TOKEN = "97a405f1664a83329a7d89ebf51dc227b90633c4ba4a2575";
// const BASE_URL = "https://api.pappers.fr/v2";
// const USER_AGENT =
//   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

// // Generic fetcher with basic error handling
// async function fetchPappers(url) {
//   const response = await fetch(url, {
//     headers: { "User-Agent": USER_AGENT },
//   });

//   if (!response.ok) {
//     throw new Error(`Request failed: ${response.statusText}`);
//   }

//   return response.json();
// }

// // Get company name from SIREN if necessary
// async function resolveQuery(query) {
//   if (isNaN(query)) return query;

//   const url = `${BASE_URL}/entreprise/cartographie?api_token=${API_TOKEN}&siren=${query}&inclure_entreprises_dirigees=true&inclure_entreprises_citees=false&inclure_sci=true&autoriser_modifications=true`;
//   const data = await fetchPappers(url);

//   const company = data?.entreprises?.[0]?.nom_entreprise;
//   // Dirigeants names
//   const first_name = data?.personnes?.[0]?.prenom;
//   const last_name = data?.personnes?.[0]?.nom;
//   const full_name = first_name + " " + last_name;

//   if (!company) throw new Error("No company found for the provided SIREN.");

//   return company;
// }

// // Fetch all paginated results
// async function fetchAllResults(searchQuery) {
//   const allResults = [];
//   let currentPage = 1;
//   let totalPages = 1;

//   do {
//     const url = `${BASE_URL}/recherche?q=${encodeURIComponent(
//       searchQuery
//     )}&api_token=${API_TOKEN}&precision=standard&bases=entreprises,dirigeants,publications&page=${currentPage}&par_page=400&case_sensitive=false`;

//     try {
//       const data = await fetchPappers(url);

//       if (!Array.isArray(data.resultats)) {
//         console.warn(
//           `Invalid resultats array on page ${currentPage}, skipping.`
//         );
//         break;
//       }

//       allResults.push(...data.resultats);

//       if (currentPage === 1) {
//         const totalResults = data.total_results ?? 0;
//         totalPages = Math.ceil(totalResults / 400);
//       }
//     } catch (error) {
//       console.warn(`Error on page ${currentPage}: ${error.message}`);
//     }

//     currentPage++;
//   } while (currentPage <= totalPages);

//   return allResults;
// }

// // Clean and format the output
// function formatResults(results) {
//   return results.map(
//     ({
//       nom_entreprise,
//       forme_juridique,
//       categorie_juridique,
//       siren,
//       code_naf,
//       siege,
//     }) => ({
//       nom_entreprise,
//       forme_juridique,
//       categorie_juridique,
//       siren,
//       code_naf,
//       siege,
//     })
//   );
// }

// // Public functions
// async function scraper(query) {
//   try {
//     const searchQuery = await resolveQuery(query);
//     const results = await fetchAllResults(searchQuery);
//     return formatResults(results);
//   } catch (error) {}
// }

// async function enrich(query) {
//   // In this case, scraper and enrich do exactly the same
//   return scraper(query);
// }

// module.exports = { scraper, enrich };
