const AVAILABLE_COLUMNS = [
    "entreprise_name",
    "type",
    "phone_number",
    "address",
    "website",
    "stars_count",
    "reviews_count",
    "siren_number",
    "siret_number",
    "naf_code",
    "activite_principale",
    "employees_count",
    "full_name",
    "email_address",
];

const { Google, Pappers } = require("./src/functions");

function _isSiren(val) {
    return /^\d{9}$/.test(val);
}
function _isSiret(val) {
    return /^\d{14}$/.test(val);
}

function formatResult(res) {
    return {
        dirigeant: res.full_name,
        nom_entreprise: res.nom_entreprise,
        type: res.type,
        phone_number: res.phone_number,
        website: res.website,
        stars_count: res.stars,
        reviews_count: res.reviews,
        siren_number: res.siren_number,
        forme_juridique: res.forme_juridique,
        categorie_juridique: res.categorie_juridique,
        code_naf: res.code_naf,
        siret_number: res.siret_number || res.siege?.siret,
        adresse_ligne_1: res.adresse_ligne_1 || res.siege?.adresse_ligne_1,
        adresse_ligne_2: res.adresse_ligne_2 || res.siege?.adresse_ligne_2,
        code_postal: res.code_postal || res.siege?.code_postal,
        ville: res.ville || res.siege?.ville,
        pays: res.pays || res.siege?.pays,
        code_pays: res.code_pays || res.siege?.code_pays,
    };
}

/**
 * Tente d'enrichir la donnée via Pappers puis Google.
 * Si Pappers renvoie un résultat, on cherche sur Google avec le nom d'entreprise
 * (pensez à passer `location` ou fallback sur l'adresse Pappers si fourni).
 * Si les noms matchent strictement, on merge Pappers+Google,
 * sinon on retourne le résultat Pappers seul.
 * Si Pappers ne retourne rien, on tombe back sur Google seule.
 */
async function fetchDataWithRetry(query, location = null, retryCount = 0) {
    let pappersRes = null;
    try {
        pappersRes = await Pappers.enrich(query);
    } catch (err) {
        // pas de résultat Pappers, on ignore
    }

    // Déterminer le nom et la localisation à interroger sur Google
    let googleQuery = query;
    let googleLocation = location;
    if (pappersRes && pappersRes.nom_entreprise) {
        googleQuery = pappersRes.nom_entreprise;
        // si aucun location fourni, on utilise l'adresse Pappers
        googleLocation = location || pappersRes.siege?.adresse_ligne_1;
    }

    let googleRes = null;
    try {
        googleRes = await Google.Enricher(googleQuery, googleLocation);
    } catch (err) {
        // si Google échoue, on retente ou ignore selon retryCount
        if (retryCount < 1) {
            return fetchDataWithRetry(query, location, retryCount + 1);
        }
    }

    // Si on a les deux sources, on compare les noms pour s'assurer qu'on merge le bon résultat
    if (pappersRes && googleRes) {
        const nameP = pappersRes.nom_entreprise.trim().toLowerCase();
        const nameG = (googleRes.nom_entreprise || googleQuery)
            .trim()
            .toLowerCase();
        if (nameP === nameG) {
            // fusionne Pappers + Google (Google écrase les champs communs pour mettre à jour)
            return {
                ...pappersRes,
                ...googleRes,
            };
        }
        // sinon on considère que Pappers est plus fiable
        return pappersRes;
    }

    // Si seul Pappers a répondu
    if (pappersRes) return pappersRes;
    // Sinon on retombe sur Google seul
    return googleRes;
}

(async () => {
    const raw = await fetchDataWithRetry("GERBI AVOCAT 74");
    console.log("Formatted result:", formatResult(raw));
})();
