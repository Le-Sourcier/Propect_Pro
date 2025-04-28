const { Google, Pappers } = require("../../functions");
const { scraping_jobs: Jobs, Users } = require("../../models");
const db = require("../../models");
const { serverMessage } = require("../../utils");

module.exports = {
  // Enrich data from CSV, xlsx, or xls file
  enrichData: async (req, res) => {
    const { query } = req.body;
    try {
      // const enrichData = await Google.Enricher(name, location);
      const enrichData = await Pappers.enrich(query);

      if (!enrichData) {
        return serverMessage(res, "NO_DATA_FOUND");
      }

      return res.status(200).json({
        message: "Data enriched successfully",
        data: enrichData,
      });
    } catch (error) {
      console.error("Error in enrichData:", error);
      return serverMessage(res, "ENRICHMENT_FAILED");
    }
  },
};
