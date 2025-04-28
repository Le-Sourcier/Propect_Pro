const { Google, Pappers } = require("../../functions");
const { serverMessage } = require("../../utils");

module.exports = {
  enrichData: async (req, res) => {
    const { query, location } = req.body;

    try {
      // 1) On récupère Google et Pappers en parallèle
      const [googleData, pappersDataArray] = await Promise.all([
        Google.Enricher(query, location),
        Pappers.enrich(query),
      ]);

      // 2) Premier élément Pappers (le plus pertinent)
      const pappers =
        Array.isArray(pappersDataArray) && pappersDataArray.length
          ? pappersDataArray[0]
          : {};

      // 4) On vérifie qu’on a au moins quelque chose
      if (!pappers && !googleData) {
        return serverMessage(res, "NO_DATA_FOUND");
      }

      return res.status(200).json({
        message: "Data enriched successfully",
        data: googleData,
      });
    } catch (error) {
      console.error("Error in enrichData:", error);
      return serverMessage(res, "ENRICHMENT_FAILED");
    }
  },
};
