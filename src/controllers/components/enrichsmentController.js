const { Google, Pappers } = require("../../functions");
const { enrich_jobs: EnrichJobs, Users } = require("../../models");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const dayjs = require("dayjs");
const { stringify } = require("csv-stringify/sync");
const { parse } = require("csv-parse/sync");
const { v4: uuidv4 } = require("uuid");
const { serverMessage } = require("../../utils");

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
            // console.log("SIREN/SIRET detected", query);
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
    console.log("googleData: ", googleData);

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

async function processAndEnrichData(filePath, mapping, file_id, io) {
    try {
        // Read and parse CSV file
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        const enrichedRecords = [];
        let enrichedCount = 0;
        const totalRecords = records.length;

        // Update initial job status
        const initialJob = await EnrichJobs.findByPk(file_id);
        await initialJob.update({ status: "in_progress" });

        // Create reverse mapping for easier lookup
        const reverseMapping = Object.entries(mapping).reduce(
            (acc, [newKey, oldKey]) => {
                if (oldKey) acc[oldKey] = newKey;
                return acc;
            },
            {}
        );

        // Process each record
        for (const record of records) {
            let enrichedData = null;
            const availableKeys = Object.values(reverseMapping);

            // Try SIRET first
            if (
                availableKeys.includes("siret") &&
                record["siret"] &&
                _isSiret(record["siret"])
            ) {
                enrichedData = await enrichCompanyData(record["siret"]);
            }
            // Then try SIREN
            else if (
                !enrichedData &&
                availableKeys.includes("siren") &&
                record["siren"] &&
                _isSiren(record["siren"])
            ) {
                enrichedData = await enrichCompanyData(record["siren"]);
            }
            // Finally try company name with address
            else if (
                !enrichedData &&
                availableKeys.includes("company_name") &&
                record["company_name"]
            ) {
                const location = availableKeys.includes("address")
                    ? record["address"]
                    : null;
                enrichedData = await enrichCompanyData(
                    record["company_name"],
                    location
                );
            }

            // Create enriched record
            const enrichedRecord = { ...enrichedData };
            if (enrichedData) {
                enrichedCount++;
                // Update only the fields that exist in the mapping
                for (const [newKey, oldKey] of Object.entries(mapping)) {
                    if (oldKey && enrichedData[newKey] !== undefined) {
                        enrichedRecord[oldKey] = enrichedData[newKey];
                    }
                }
            }
            enrichedRecords.push(enrichedRecord);

            // Update progress every 5 records or when it's the last record
            if (
                enrichedRecords.length % 5 === 0 ||
                enrichedRecords.length === totalRecords
            ) {
                const job = await EnrichJobs.findByPk(file_id);
                await job.update({
                    enriched: enrichedCount,
                    status:
                        enrichedRecords.length === totalRecords
                            ? "completed"
                            : "in_progress",
                });

                io.emit("jobStatusUpdate", {
                    id: file_id,
                    status: job.status,
                    name: job.name,
                    records: totalRecords,
                    enriched: enrichedCount,
                    link: job.link,
                });
            }
        }

        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, "../../uploads/enriched");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write enriched data to file
        const outputPath = path.join(outputDir, `enriched_${file_id}.csv`);
        const csvContent = stringify(enrichedRecords, {
            header: true,
            quoted: true,
        });
        fs.writeFileSync(outputPath, csvContent);

        // Final job update
        const finalStatus = enrichedCount > 0 ? "completed" : "failed";
        const job = await EnrichJobs.findByPk(file_id);
        await job.update({
            status: finalStatus,
            link: outputPath,
            enriched: enrichedCount,
        });

        // Final status update
        io.emit("jobStatusUpdate", {
            id: file_id,
            status: "completed",
            name: job.name,
            records: totalRecords,
            enriched: enrichedCount,
            link: outputPath,
        });

        return outputPath;
    } catch (error) {
        // Update job status to failed
        const job = await EnrichJobs.findByPk(file_id);
        await job.update({ status: "failed" });

        io.emit("jobStatusUpdate", {
            id: file_id,
            status: "failed",
            name: job.name,
            records: job.records,
            enriched: job.enriched,
            link: null,
        });

        console.error("Error processing and enriching data:", error);
        throw error;
    }
}

/**
 * Count the number of records in a file (excluding header)
 * @param {string} filePath - Path to the file
 * @returns {number} - Number of records
 */
function countRecords(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    // Split by newline and subtract 1 for header
    return content.split("\n").length - 1;
}

/**
 * Creates a temporary file with the uploaded content and returns its path
 * @param {Object} file - The uploaded file object
 * @returns {string} - Path to the temporary file
 */
function saveUploadedFile(file) {
    const uploadDir = path.join(__dirname, "../../uploads/temp");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = path.extname(file.originalname) || ".csv";
    const tempPath = path.join(uploadDir, `temp_${uuidv4()}${fileExt}`);

    // Copy the file from multer's temporary location to our temporary location
    fs.copyFileSync(file.path, tempPath);
    // Then remove the temporal file from the folder
    fs.unlinkSync(file.path);

    return tempPath;
}

async function mappedFile(filePath, file_id, mapping) {
    try {
        // Read and parse the CSV file
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        if (records.length === 0) {
            throw new Error("Empty file");
        }

        // Get the original headers from the first record
        const originalHeaders = Object.keys(records[0]);

        // Create reverse mapping (old header -> new header)
        const reverseMapping = {};
        for (const [newHeader, oldHeader] of Object.entries(mapping)) {
            if (oldHeader && originalHeaders.includes(oldHeader)) {
                reverseMapping[oldHeader] = newHeader;
            }
        }

        // Map the records
        const mappedRecords = records.map((record) => {
            const mappedRecord = {};
            for (const oldHeader of originalHeaders) {
                // If this header is in our mapping, use the new header name
                const newHeader = reverseMapping[oldHeader] || oldHeader;
                mappedRecord[newHeader] = record[oldHeader];
            }
            return mappedRecord;
        });

        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, "../../uploads/mapped");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Generate output filename
        const fileExt = path.extname(filePath);
        const outputPath = path.join(outputDir, `mapped_${file_id}${fileExt}`);

        // Write the mapped file
        const csvContent = stringify(mappedRecords, {
            header: true,
            quoted: true,
        });
        fs.writeFileSync(outputPath, csvContent);

        return outputPath;
    } catch (error) {
        console.error("Error mapping file:", error);
        throw error;
    }
}

/**
 *@param {string} id - file unique id for identification
 *@param {string} user_id - user unique id
 *@param {string} name - upload original file name
 *@param {object} sources - list of enrichment source
 *@param {number} records - number of records in file
 */
const createJob = async (id, user_id, name, sources, records) => {
    return await EnrichJobs.create({
        id,
        user_id,
        name,
        sources,
        records,
        enriched: 0,
        status: "in_progress",
        link: null,
    });
};

module.exports = {
    enrichFile: async (req, res) => {
        try {
            const { file } = req;
            const meta = JSON.parse(req.body.meta);
            const { mapping, sources, expected_columns, user_id } = meta;
            const name = file.originalname;

            if (sources.length <= 0)
                return serverMessage(res, "ENRICH_SOURCE_IS_EMPTY");

            if (!file || !mapping || !user_id) {
                return serverMessage(res, "REQUIRED_FIELDS_MISSING");
            }

            const file_id = uuidv4();

            // Save the uploaded file to a temporary location
            const tempFilePath = saveUploadedFile(file);
            const records = countRecords(tempFilePath);

            // Reusable constante
            let mappedFilePath;

            try {
                // Create the job first
                const job = await createJob(
                    file_id,
                    user_id,
                    name,
                    sources,
                    records
                );

                // Process the file and start enrichment
                mappedFilePath = await mappedFile(
                    tempFilePath,
                    file_id,
                    mapping
                );
                const enrichedFilePath = await processAndEnrichData(
                    mappedFilePath,
                    mapping,
                    file_id,
                    req.app.get("io")
                );

                if (enrichedFilePath) {
                    const data = {
                        id: job.id,
                        name: job.name.replace(/\.(csv|xls|xlsx|xlsl)$/i, ""),
                        status: job.status,
                        records: job.records,
                        enriched: job.enriched,
                        link: job.link,
                        date: dayjs(job.createdAt).format("ddd MMM YYYY HH:mm"),
                        sources: job.sources,
                    };

                    // Clean up temporary files
                    fs.unlinkSync(tempFilePath);
                    fs.unlinkSync(mappedFilePath);

                    return serverMessage(res, "ENRICH_CREATED", data);
                }
            } catch (error) {
                // Clean up temporary files in case of error
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
                if (fs.existsSync(mappedFilePath)) {
                    fs.unlinkSync(mappedFilePath);
                }
                throw error;
            }

            return serverMessage(res, "ENRICHMENT_FAILED");
        } catch (error) {
            console.error("Error in enrichFile:", error);
            return serverMessage(res, "SERVER_ERROR");
        }
    },
    getAllJobs: async (req, res) => {
        const { user_id } = req.body;

        try {
            const user = await Users.findByPk(user_id);
            if (!user) {
                return serverMessage(res, "UNAUTHORIZED_ACCESS");
            }

            const jobs = await EnrichJobs.findAll({
                where: { user_id: user.id },
                order: [["createdAt", "DESC"]],
            });

            const result = jobs.map((job) => {
                const nameWithoutExtension = job.name.replace(
                    /\.(csv|xls|xlsx|xlsl)$/i,
                    ""
                );

                return {
                    id: job.id,
                    name: nameWithoutExtension,
                    status: job.status,
                    records: job.records,
                    enriched: parseInt(job.enriched) || 0,
                    date: dayjs(job.createdAt).format("ddd MMM YYYY HH:mm"),
                    sources: job.sources,
                };
            });

            return serverMessage(res, "DATA_FETCH_SUCCESS", result);
        } catch (error) {
            console.error(error);
            return serverMessage(res, "SERVER_ERROR");
        }
    },
    downloadFile: async (req, res) => {
        const { fileId } = req.params;
        const pathToRoot = path.resolve(__dirname, "../..");
        const enrichedDir = path.join(pathToRoot, "uploads", "enriched");

        // 1. Get the job from database
        const job = await EnrichJobs.findByPk(fileId);
        if (!job || !job.name) {
            return serverMessage(res, "FILE_NOT_FOUND");
        }

        // 2. Find the physical file
        const files = fs.readdirSync(enrichedDir);
        const matchedFile = files.find((file) =>
            file.startsWith(`enriched_${fileId}.`)
        );

        if (!matchedFile) {
            return serverMessage(res, "FILE_NOT_FOUND");
        }

        // 3. Build paths and MIME type
        const filePath = path.join(enrichedDir, matchedFile);
        const finalFileName = job.name;
        const mimeType =
            mime.lookup(finalFileName) || "application/octet-stream";

        // 4. Add explicit headers
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${finalFileName}"`
        );
        res.setHeader("Content-Type", mimeType);

        // 5. Send the file
        res.sendFile(filePath);
    },
};
