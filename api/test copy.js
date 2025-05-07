const { Google, Pappers } = require("./src/functions");

/**
 * Enriches company data by combining information from Pappers and Google APIs.
 *
 * Logic flow:
 * 1. Query Pappers with the provided search term
 * 2. If Pappers returns data, use the company name to search Google
 *    (with location if provided, or fall back to Pappers address)
 * 3. If both sources return data, merge them
 * 4. If Pappers fails but Google succeeds, return Google data
 * 5. If both fail, return null
 *
 * @param {string} query - Search term (company name, SIREN, SIRET)
 * @param {string|null} location - Optional location to refine Google search
 * @returns {Promise<Object|null>} - The enriched company data or null if not found
 */
async function enrichCompanyData(query, location = null) {
    // Step 1: Query Pappers API
    let pappersData = null;
    try {
        // Determine if query is a SIREN/SIRET number
        if (_isSiren(query) || _isSiret(query)) {
            pappersData = await Pappers.enrich(query);
        } else {
            // Regular company name search
            pappersData = await Pappers.enrich(query);
        }
    } catch (error) {
        console.log(`Pappers API error: ${error.message}`);
    }

    // Step 2: Prepare for Google search
    let googleQuery = query;
    let googleLocation = location;

    // If Pappers returned data, refine Google search with company name
    if (pappersData && pappersData.nom_entreprise) {
        googleQuery = pappersData.nom_entreprise;

        // If no location provided, use Pappers address as fallback location
        if (!location && pappersData.siege) {
            const address = pappersData.siege;
            googleLocation = address.ville
                ? `${address.adresse_ligne_1}, ${address.code_postal} ${address.ville}, ${address.pays}`
                : address.adresse_ligne_1;
        }
    }

    // Step 3: Query Google API
    let googleData = null;
    try {
        googleData = await Google.Enricher(googleQuery, googleLocation);
    } catch (error) {
        console.log(`Google API error: ${error.message}`);

        // If we have Pappers data but Google failed, return Pappers data only
        if (pappersData) {
            return formatResult(pappersData);
        }

        // Both APIs failed
        return null;
    }

    // Step 4: Merge data if appropriate
    if (pappersData && googleData) {
        const mergedData = {
            ...pappersData,
            type: googleData.type,
            phone_number: googleData.phone_number,
            website: googleData.website,
            stars: googleData.stars,
            reviews: googleData.reviews,
            address: googleData.address,
            codePlus: googleData.codePlus,
        };

        return formatResult(mergedData);
    }

    // Step 5: Handle case where only one API returned data
    if (pappersData) {
        return formatResult(pappersData);
    }

    if (googleData) {
        return formatResult(googleData);
    }

    // Step 6: No data found
    return null;
}

/**
 * Helper function to check if value is a valid SIREN number
 * @param {string} val - Value to check
 * @returns {boolean} - True if valid SIREN
 */
function _isSiren(val) {
    return /^\d{9}$/.test(val);
}

/**
 * Helper function to check if value is a valid SIRET number
 * @param {string} val - Value to check
 * @returns {boolean} - True if valid SIRET
 */
function _isSiret(val) {
    return /^\d{14}$/.test(val);
}

/**
 * Format result from APIs into standardized structure
 * @param {Object} res - Response object from either API
 * @returns {Object} - Formatted result
 */
function formatResult(res) {
    return {
        dirigeant: res.full_name || res.dirigeant,
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

module.exports = {
    enrichCompanyData,
    formatResult,
};

// Example usage
(async () => {
    const raw = await enrichCompanyData("GERBI AVOCAT 74");
    console.log("Formatted result:", formatResult(raw));
})();
