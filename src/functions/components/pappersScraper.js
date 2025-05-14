// src/functions/pappersEnricher.js
const fetch = require("node-fetch");
const InseeSiren = require("./inseeSirenScraper");

const API_TOKEN = "97a405f1664a83329a7d89ebf51dc227b90633c4ba4a2575";
const BASE_URL = "https://api.pappers.fr/v2";
const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

if (!API_TOKEN) {
    throw new Error("Missing API_PAPPERS_TOKEN");
}

function isSiren(val) {
    return /^\d{9}$/.test(val);
}
function isSiret(val) {
    return /^\d{14}$/.test(val);
}

async function fetchPappers(url) {
    const res = await fetch(url);
    if (!res.ok) {
        // console.log(res);
        // throw new Error(`Pappers API error: ${res.statusText}`);
    }
    return res.json();
}

// 1.0) Given a SIREN, fetch both company data and dirigeants (from suggestion mode)

// 1.1) Given a SIREN, fetch both company data and dirigeants
async function fetchEntrepriseDataSuggestion(siren) {
    const url = `${BASE_URL}?api_token=${API_TOKEN}&q=${siren}&longueur=9&cibles=siren`;

    const data = await fetchPappers(url);
    const companyName = data?.resultats_siren?.[0]?.nom_entreprise || null;
    const fullName = [data.prenom, data.nom].filter(Boolean).join(" ");

    return { companyName, fullName };
}
async function fetchEntrepriseData(siren) {
    return await fetchEntrepriseDataSuggestion(siren);

    // try {
    //     const url =
    //         `${BASE_URL}/entreprise/cartographie` +
    //         `?api_token=${API_TOKEN}` +
    //         `&siren=${siren}` +
    //         `&inclure_entreprises_dirigees=true` +
    //         `&inclure_entreprises_citees=false` +
    //         `&inclure_sci=true` +
    //         `&autoriser_modifications=true`;

    //     const data = await fetchPappers(url);
    //     const companyName = data?.entreprises?.[0]?.nom_entreprise || null;
    //     const dir = Array.isArray(data.personnes) ? data.personnes[0] : null;
    //     const fullName = dir
    //         ? [dir.prenom, dir.nom].filter(Boolean).join(" ")
    //         : null;

    //     return { companyName, fullName };
    // } catch (error) {
    //     return await fetchEntrepriseDataSuggestion();
    // }
}

// 2) Build a recherche URL for free-text lookups
function buildSearchUrl(q, page = 1, limit = 100) {
    const encoded = encodeURIComponent(q);
    return (
        `${BASE_URL}/recherche` +
        `?q=${encoded}` +
        `&api_token=${API_TOKEN}` +
        `&precision=standard` +
        `&bases=entreprises,dirigeants,publications` +
        `&page=${page}` +
        `&par_page=${limit}` +
        `&case_sensitive=false`
    );
}

// 3) Resolve any input into { siren, companyName, fullName }
async function resolveQuery(query, limite) {
    const trimmed = query;

    // A) If already a SIREN
    if (isSiren(trimmed)) {
        const { companyName, fullName } = await fetchEntrepriseData(trimmed);
        return { siren: trimmed, companyName, fullName };
    }

    // B) If a SIRET, first convert to SIREN + name via Insee API
    if (isSiret(trimmed)) {
        const info = await InseeSiren.scraper(trimmed);
        if (!info || !info.siren_number) {
            throw new Error("Unable to convert SIRET → SIREN");
        }
        const { companyName, fullName } = await fetchEntrepriseData(
            info.siren_number
        );
        return {
            siren: info.siren_number,
            companyName: companyName || info.nom_entreprise,
            fullName,
        };
    }

    // C) Otherwise assume it's a free-text name: do a /recherche → grab the first siren
    const searchRes = await fetchPappers(buildSearchUrl(trimmed, 1, limite));
    const first = Array.isArray(searchRes.resultats) && searchRes.resultats[0];
    if (!first || !first.siren) {
        return { siren: null, companyName: trimmed, fullName: null };
    }

    // Now that we have a SIREN, fetch the dirigeant
    const { companyName, fullName } = await fetchEntrepriseData(first.siren);
    return {
        siren: first.siren,
        companyName: companyName || trimmed,
        fullName,
    };
}

// 4) Fetch all paged enrich results by that resolved companyName
// async function fetchAllResults(searchQuery, limite) {
//     const perPage = 100;
//     let page = 1;
//     let totalPages = 1;
//     const allResults = [];

//     do {
//         const data = await fetchPappers(
//             buildSearchUrl(searchQuery, page, perPage)
//         );

//         if (!Array.isArray(data.resultats)) break;

//         allResults.push(...data.resultats);

//         if (page === 1) {
//             const total = data.total_results || data.total || 0;
//             totalPages = Math.ceil(total / perPage);
//             console.log(`🧮 Total results: ${total}, Pages: ${totalPages}`);
//         }

//         page++;
//     } while (page <= totalPages);

//     return allResults;
// }

async function fetchAllResults(searchQuery, limite = 0) {
    const perPage = 100;
    let page = 1;
    let totalPages = 1;
    const allResults = [];

    do {
        const data = await fetchPappers(
            buildSearchUrl(searchQuery, page, perPage)
        );

        if (!Array.isArray(data.resultats)) break;

        allResults.push(...data.resultats);

        if (page === 1) {
            const total = data.total_results || data.total || 0;
            totalPages = Math.ceil(total / perPage);
            console.log(`🧮 Total results: ${total}, Pages: ${totalPages}`);
        }

        // Stop early if we reached the limit
        if (limite > 0 && allResults.length >= limite) {
            break;
        }

        page++;
    } while (page <= totalPages);

    // Trim the array if we went over the limit
    return limite > 0 ? allResults.slice(0, limite) : allResults;
}

// 5) Format final output
function formatResults(results, fullName) {
    return results.map((r) => ({
        dirigeant: fullName,
        nom_entreprise: r.nom_entreprise,
        siren_number: r.siren,
        forme_juridique: r.forme_juridique,
        categorie_juridique: r.categorie_juridique,
        code_naf: r.code_naf,
        siege: r.siege,
    }));
}

// Public scraper entrypoint
async function scraper(query, limite) {
    try {
        const { siren, companyName, fullName } = await resolveQuery(
            query,
            limite
        );
        const list = await fetchAllResults(companyName, limite);
        return {
            siren,
            companyName,
            dirigeant: fullName,
            total: list.length,
            entreprises: formatResults(list, fullName),
        };
    } catch (err) {
        console.error("Scraper failed:", err);
        return { error: err.message, total: 0, entreprises: [] };
    }
}

async function enrich(query) {
    return scraper(query).then((acc) => acc.entreprises[0]);
}

module.exports = { scraper, enrich };

// (async () => {
//     const query = "Hotels";
//     const result = await scraper(query);
//     console.log(
//         "Result: ",
//         result.entreprises.map((itm) => itm.siege.siret)
//     );
// })();
