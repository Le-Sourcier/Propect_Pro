const { Google, Pappers } = require("../../functions");
const { serverMessage } = require("../../utils");

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
    website: googleData?.website || null,
    stars_count: googleData?.stars || null,
    reviews_count: googleData?.reviews || null,
    siren_number: pappers?.siren || null,
    siret_number: pappers?.siege?.siret_formate || null,
    naf_code: pappers?.code_naf || null,
    activite_principale: googleData?.type || null,
    employees_count: null,
    full_name: pappers.dirigeant || pappers.full_name || null,
    email_address: null,
  };
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
    const [googleData, pappersDataArray] = await Promise.all([
      Google.Enricher(query, location),
      Pappers.enrich(query),
    ]);

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
      // Input validation
      if (!query) {
        return serverMessage(res, "BAD_REQUEST");
      }

      // Validate requested columns
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

      // Validate each requested column
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

      // Fetch data with retry mechanism
      const enrichedData = await fetchDataWithRetry(query, location);

      // If still no data after retries
      if (!enrichedData) {
        return serverMessage(res, "NO_DATA_FOUND");
      }

      // Filter the data based on requested columns
      const filteredData = filterColumns(enrichedData, requestedColumns);

      // Return the enriched and filtered data
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
};
