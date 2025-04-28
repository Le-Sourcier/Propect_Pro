const { Google, Pappers } = require("../../functions");
const { serverMessage } = require("../../utils");

const formatAddress = (siege) => {
  if (!siege) return null;
  const parts = [];

  if (siege.numero_voie) parts.push(siege.numero_voie);
  if (siege.type_voie) parts.push(siege.type_voie);
  if (siege.libelle_voie) parts.push(siege.libelle_voie);
  if (siege.complement_adresse) parts.push(siege.complement_adresse);
  if (siege.code_postal) parts.push(siege.code_postal);
  if (siege.ville) parts.push(siege.ville);
  if (siege.pays) parts.push(siege.pays);

  return parts.join(" ");
};

const mergeAndFormatData = (googleData, pappersData) => {
  // If no data from either source, return null
  if (!googleData && (!pappersData || !pappersData.length)) {
    return null;
  }

  const pappers = pappersData && pappersData.length ? pappersData[0] : null;

  return {
    entreprise_name: pappers?.nom_entreprise || googleData?.title || null,
    type: googleData?.type || null,
    phone_number: googleData?.phone || null,
    address: pappers?.siege
      ? formatAddress(pappers.siege)
      : googleData?.address || null,
    siren_number: pappers?.siren || null,
    siret_number: pappers?.siege?.siret_formate || null,
    naf_code: pappers?.code_naf || null,
    activite_principale: googleData?.type || null,
    employees_count: null, // Not available in current data sources
    full_name: null, // Not available in current data sources
    email_address: null, // Not available in current data sources
  };
};

module.exports = {
  enrichData: async (req, res) => {
    const { query, location } = req.body;

    try {
      // Input validation
      if (!query) {
        return serverMessage(res, "BAD_REQUEST");
      }

      // 1) Fetch data from both sources in parallel
      const [googleData, pappersDataArray] = await Promise.all([
        Google.Enricher(query, location),
        Pappers.enrich(query),
      ]);

      // 2) Merge and format the data
      const enrichedData = mergeAndFormatData(googleData, pappersDataArray);

      // 3) Check if we have any data
      if (!enrichedData) {
        return serverMessage(res, "NO_DATA_FOUND");
      }

      // 4) Return the enriched data
      return res.status(200).json({
        error: false,
        status: 200,
        message: "Data enriched successfully",
        data: enrichedData,
      });
    } catch (error) {
      console.error("Error in enrichData:", error);
      return serverMessage(res, "ENRICHMENT_FAILED");
    }
  },
};
