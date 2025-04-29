const { Google, Pappers } = require("../../functions");
const { serverMessage } = require("../../utils");
const { uploadFile, cleanupTempFile } = require("../../utils");
const fs = require("fs");
const path = require("path");
const { stringify } = require("csv-stringify/sync");

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

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

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
  if (!googleData && (!pappersData || !pappersData.length)) {
    return null;
  }

  const pappers = pappersData && pappersData.length ? pappersData[0] : null;

  // Create base data from Pappers
  const baseData = {
    entreprise_name: pappers?.nom_entreprise || null,
    type: null,
    phone_number: null,
    address: pappers?.siege ? formatAddress(pappers.siege) : null,
    website: null,
    stars_count: null,
    reviews_count: null,
    siren_number: pappers?.siren || null,
    siret_number: pappers?.siege?.siret_formate || null,
    naf_code: pappers?.code_naf || null,
    activite_principale: null,
    employees_count: null,
    full_name: pappers?.dirigeant || null,
    email_address: null,
  };

  // If we have Google data, enrich the base data
  if (googleData) {
    baseData.type = googleData.type || baseData.type;
    baseData.phone_number = googleData.phone || baseData.phone_number;
    baseData.address = baseData.address || googleData.address;
    baseData.website = googleData.website || baseData.website;
    baseData.stars_count = googleData.stars || baseData.stars_count;
    baseData.reviews_count = googleData.reviews || baseData.reviews_count;
    baseData.activite_principale =
      googleData.type || baseData.activite_principale;
  }

  return baseData;
};

const filterColumns = (data, columns) => {
  if (!data || !columns || !columns.length) return data;

  const filteredData = {};
  columns.forEach((column) => {
    if (AVAILABLE_COLUMNS.includes(column) && data.hasOwnProperty(column)) {
      filteredData[column] = data[column];
    }
  });
  return filteredData;
};

const fetchDataWithRetry = async (query, location, retryCount = 0) => {
  try {
    // First try Pappers
    const pappersDataArray = await Pappers.enrich(query);
    let googleData = null;

    // If we have Pappers data and it's a SIREN search, try Google with company name
    if (pappersDataArray?.length > 0 && /^\d+$/.test(query)) {
      const companyName = pappersDataArray[0].nom_entreprise;
      if (companyName) {
        googleData = await Google.Enricher(companyName, location);
      }
    } else {
      // If not a SIREN search or no Pappers data, try Google with original query
      googleData = await Google.Enricher(query, location);
    }

    const enrichedData = mergeAndFormatData(googleData, pappersDataArray);

    // Check if we have meaningful data
    const hasData =
      enrichedData &&
      Object.values(enrichedData).some((value) => value !== null);

    if (!hasData && retryCount < MAX_RETRIES) {
      console.log(
        `Attempt ${retryCount + 1}/${MAX_RETRIES}: No data found, retrying...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchDataWithRetry(query, location, retryCount + 1);
    }

    return enrichedData;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(
        `Attempt ${retryCount + 1}/${MAX_RETRIES}: Error occurred, retrying...`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchDataWithRetry(query, location, retryCount + 1);
    }
    throw error;
  }
};

module.exports = {
  enrichData: async (req, res) => {
    const { query, location, rows } = req.body;

    try {
      if (!query) {
        return serverMessage(res, "BAD_REQUEST");
      }

      const requestedColumns = Array.isArray(rows) ? rows : [];
      if (requestedColumns.length === 0) {
        return res.status(400).json({
          error: true,
          status: 400,
          message:
            "No columns specified. Please specify columns in 'rows' array.",
          availableColumns: AVAILABLE_COLUMNS,
        });
      }

      const invalidColumns = requestedColumns.filter(
        (col) => !AVAILABLE_COLUMNS.includes(col)
      );
      if (invalidColumns.length > 0) {
        return res.status(400).json({
          error: true,
          status: 400,
          message: "Invalid columns requested",
          invalidColumns,
          availableColumns: AVAILABLE_COLUMNS,
        });
      }

      const enrichedData = await fetchDataWithRetry(query, location);

      if (!enrichedData) {
        return serverMessage(res, "NO_DATA_FOUND");
      }

      const filteredData = filterColumns(enrichedData, requestedColumns);

      return res.status(200).json({
        error: false,
        status: 200,
        message: "Data enriched successfully",
        data: filteredData,
      });
    } catch (error) {
      console.error("Error in enrichData:", error);
      return serverMessage(res, "ENRICHMENT_FAILED");
    }
  },
  enrichDataFile: async (req, res) => {
    try {
      const rows = await uploadFile(req);
      // Each row must contain at least a 'query' and optional 'location'
      const enrichedRows = await Promise.all(
        rows.map((r) => fetchDataWithRetry(r.query, r.location))
      );
      // Generate CSV
      const csvOut = stringify(enrichedRows, { header: true });
      const outDir = path.join(__dirname, "../../uploads/enriched");
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `enriched_${Date.now()}.csv`);
      fs.writeFileSync(outPath, csvOut);
      // send and cleanup
      res.download(outPath, (err) => {
        if (err) console.error("Download error:", err);
        cleanupTempFile(outPath);
      });
    } catch (err) {
      console.error(err);
      return serverMessage(res, "ENRICHMENT_FAILED");
    }
  },
};
