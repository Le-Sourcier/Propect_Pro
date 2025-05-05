const dayjs = require("dayjs");
const { Google, Pappers } = require("../../functions");
const { enrich_jobs: EnrichJobs, Users } = require("../../models");
const { serverMessage } = require("../../utils");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { stringify } = require("csv-stringify/sync");
const { v4: uuidv4 } = require("uuid");
const csvParser = require("csv-parser");

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
const RETRY_DELAY = 2000;

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
    if (!googleData && (!pappersData || !pappersData.length)) return null;

    const pappers = pappersData && pappersData.length ? pappersData[0] : null;
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

    if (googleData) {
        baseData.entreprise_name = googleData.nom_entreprise;
        baseData.type = googleData.type || baseData.type;
        baseData.phone_number =
            googleData.phone_number || baseData.phone_number;
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
        const pappersDataArray = await Pappers.enrich(query);
        let googleData = null;

        if (pappersDataArray?.length > 0 && /^\d+$/.test(query)) {
            const companyName = pappersDataArray[0].nom_entreprise;
            if (companyName) {
                googleData = await Google.Enricher(companyName, location);
            }
        } else {
            googleData = await Google.Enricher(query, location);
        }

        const enrichedData = mergeAndFormatData(googleData, pappersDataArray);
        const hasData =
            enrichedData &&
            Object.values(enrichedData).some((value) => value !== null);

        if (!hasData && retryCount < MAX_RETRIES) {
            console.log(`Retry ${retryCount + 1}/${MAX_RETRIES}`);
            await new Promise((res) => setTimeout(res, RETRY_DELAY));
            return fetchDataWithRetry(query, location, retryCount + 1);
        }

        return enrichedData;
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            await new Promise((res) => setTimeout(res, RETRY_DELAY));
            return fetchDataWithRetry(query, location, retryCount + 1);
        }
        console.log("Error in fetch data with retry: ", error);
    }
};

const createEnrichmentJob = async (id, user_id, name, sources) => {
    return await EnrichJobs.create({
        id,
        user_id,
        name,
        sources,
        records: 0,
        enriched: 0,
        link: null,
    });
};

const updateEnrichmentJob = async (io, jobId, records, enriched, link) => {
    const status = enriched > 0 ? "completed" : "failed";

    const job = await EnrichJobs.findByPk(jobId);
    // Emit completion message after job update
    const nameWithoutExtension = job.name.replace(
        /\.(csv|xls|xlsx|xlsl)$/i,
        ""
    );

    io.emit("jobStatusUpdate", {
        id: jobId,
        status: status,
        name: nameWithoutExtension,
        records: records,
        enriched: enriched,
        link: link,
    });

    return await EnrichJobs.update(
        { records, enriched, link, status },
        { where: { id: jobId } }
    );
};

const enrichDataFile = async (io, rows, file_id, jobId) => {
    const enrichedRows = await Promise.all(
        rows.map((r) => fetchDataWithRetry(r.query, r.location))
    );

    const cleanedRows = enrichedRows.filter(Boolean);
    const csvOut = stringify(cleanedRows, {
        header: true,
        columns: AVAILABLE_COLUMNS,
    });

    const outDir = path.join(__dirname, "../../uploads/enriched");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, `enriched_${file_id}.csv`);
    fs.writeFileSync(outPath, csvOut);

    await updateEnrichmentJob(
        io,
        jobId,
        rows.length,
        cleanedRows.length,
        `/uploads/enriched/enriched_${file_id}.csv`
    );
};

module.exports = {
    enrichMapping: async (req, res) => {
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
            const result = [];

            fs.createReadStream(file.path)
                .pipe(csvParser())
                .on("data", (row) => {
                    const mapped = {};
                    for (const [key, sourceHeader] of Object.entries(mapping)) {
                        mapped[key] = row[sourceHeader] || "";
                    }
                    result.push(mapped);
                })
                .on("end", async () => {
                    fs.unlinkSync(file.path);
                    const csvOut = stringify(result, {
                        header: true,
                        columns: Object.keys(mapping),
                    });

                    const outDir = path.join(__dirname, "../../uploads/mapped");
                    if (!fs.existsSync(outDir))
                        fs.mkdirSync(outDir, { recursive: true });

                    const outPath = path.join(outDir, `mapped_${file_id}.csv`);
                    fs.writeFileSync(outPath, csvOut);

                    const id = file_id;
                    const job = await createEnrichmentJob(
                        id,
                        user_id,
                        name,
                        sources
                    );

                    enrichDataFile(
                        req.app.get("io"),
                        result,
                        file_id,
                        job.id
                    ).catch(console.error);

                    const nameWithoutExtension = job.name.replace(
                        /\.(csv|xls|xlsx|xlsl)$/i,
                        ""
                    );

                    const data = {
                        id: job.id,
                        name: nameWithoutExtension,
                        status: job.status,
                        records: job.records,
                        enriched: job.enriched,
                        link: job.link,
                        date: dayjs(job.createdAt).format("ddd MMM YYYY HH:mm"),
                        sources: job.sources,
                    };
                    return serverMessage(res, "ENRICH_CREATED", data);
                });
        } catch (err) {
            console.error(err);
            return serverMessage(res);
        }
    },

    enrichData: async (req, res) => {
        const { query, location, rows } = req.body;

        try {
            if (!query) return serverMessage(res, "BAD_REQUEST");

            const requestedColumns = Array.isArray(rows) ? rows : [];
            if (requestedColumns.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "No columns specified.",
                    availableColumns: AVAILABLE_COLUMNS,
                });
            }

            const invalidColumns = requestedColumns.filter(
                (col) => !AVAILABLE_COLUMNS.includes(col)
            );
            if (invalidColumns.length > 0) {
                return res.status(400).json({
                    error: true,
                    message: "Invalid columns requested",
                    invalidColumns,
                    availableColumns: AVAILABLE_COLUMNS,
                });
            }

            const enrichedData = await fetchDataWithRetry(query, location);
            if (!enrichedData) return serverMessage(res, "NO_DATA_FOUND");

            const filteredData = filterColumns(enrichedData, requestedColumns);

            return res.status(200).json({
                error: false,
                message: "Data enriched successfully",
                data: filteredData,
            });
        } catch (error) {
            console.error("Enrichment failed:", error);
            return res
                .status(500)
                .json({ error: true, message: "Internal Server Error" });
        }
    },

    getAllEnrichJobs: async (req, res) => {
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

        console.log("File Id: ", fileId);

        // 1. Récupérer le job en base
        const job = await EnrichJobs.findByPk(fileId);
        if (!job || !job.name) {
            return serverMessage(res, "FILE_NOT_FOUND");
        }

        // 2. Rechercher le fichier physique
        const files = fs.readdirSync(enrichedDir);
        const matchedFile = files.find((file) =>
            file.startsWith(`enriched_${fileId}.`)
        );

        if (!matchedFile) {
            return serverMessage(res, "FILE_NOT_FOUND");
        }

        // 3. Construction des chemins et du bon type MIME
        const filePath = path.join(enrichedDir, matchedFile);
        const finalFileName = job.name; // ex: test_enrichment.csv
        const mimeType =
            mime.lookup(finalFileName) || "application/octet-stream";

        // 4. Ajout des headers explicites
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${finalFileName}"`
        );
        res.setHeader("Content-Type", mimeType);

        // 5. Envoi du fichier
        res.sendFile(filePath);
    },

    // downloadFile: async (req, res) => {
    //   const { fileId } = req.params;
    //   // const enrichedDir = path.join(__dirname, "uploads", "enriched");
    //   const pathToRoot = path.resolve(__dirname, "../.."); // monte jusqu’à la racine
    //   const enrichedDir = path.join(pathToRoot, "uploads", "enriched");
    //   console.log("File Id: ", fileId);

    //   // Lister les fichiers dans le dossier enriched
    //   const files = fs.readdirSync(enrichedDir);
    //   const matchedFile = files.find((file) =>
    //     file.startsWith(`enriched_${fileId}.`)
    //   );

    //   if (!matchedFile) {
    //     return serverMessage(res, "FILE_NOT_FOUND");
    //   }

    //   const filePath = path.join(enrichedDir, matchedFile);
    //   return res.sendFile(filePath);
    // },
};

// const { Google, Pappers } = require("../../functions");
// const { enrich_jobs: EnrichJobs, Users } = require("../../models");
// const { serverMessage } = require("../../utils");
// const { uploadFile, cleanupTempFile } = require("../../utils");
// const fs = require("fs");
// const path = require("path");
// const { stringify } = require("csv-stringify/sync");
// const { v4: uuidv4 } = require("uuid"); // pour générer un ID unique
// const csvParser = require("csv-parser");
// const pLimit = require("p-limit");

// const AVAILABLE_COLUMNS = [
//   "entreprise_name",
//   "type",
//   "phone_number",
//   "address",
//   "website",
//   "stars_count",
//   "reviews_count",
//   "siren_number",
//   "siret_number",
//   "naf_code",
//   "activite_principale",
//   "employees_count",
//   "full_name",
//   "email_address",
// ];

// const MAX_RETRIES = 3;
// const RETRY_DELAY = 2000; // 2 seconds

// const formatAddress = (siege) => {
//   if (!siege) return null;
//   const parts = [];

//   if (siege.numero_voie) parts.push(siege.numero_voie);
//   if (siege.type_voie) parts.push(siege.type_voie);
//   if (siege.libelle_voie) parts.push(siege.libelle_voie);
//   if (siege.complement_adresse) parts.push(siege.complement_adresse);
//   if (siege.code_postal) parts.push(siege.code_postal);
//   if (siege.ville) parts.push(siege.ville);
//   if (siege.pays) parts.push(siege.pays);

//   return parts.join(" ");
// };

// const mergeAndFormatData = (googleData, pappersData) => {
//   if (!googleData && (!pappersData || !pappersData.length)) {
//     return null;
//   }

//   const pappers = pappersData && pappersData.length ? pappersData[0] : null;

//   // Create base data from Pappers
//   const baseData = {
//     entreprise_name: pappers?.nom_entreprise || null,
//     type: null,
//     phone_number: null,
//     address: pappers?.siege ? formatAddress(pappers.siege) : null,
//     website: null,
//     stars_count: null,
//     reviews_count: null,
//     siren_number: pappers?.siren || null,
//     siret_number: pappers?.siege?.siret_formate || null,
//     naf_code: pappers?.code_naf || null,
//     activite_principale: null,
//     employees_count: null,
//     full_name: pappers?.dirigeant || null,
//     email_address: null,
//   };

//   // If we have Google data, enrich the base data
//   if (googleData) {
//     baseData.type = googleData.type || baseData.type;
//     baseData.phone_number = googleData.phone || baseData.phone_number;
//     baseData.address = baseData.address || googleData.address;
//     baseData.website = googleData.website || baseData.website;
//     baseData.stars_count = googleData.stars || baseData.stars_count;
//     baseData.reviews_count = googleData.reviews || baseData.reviews_count;
//     baseData.activite_principale =
//       googleData.type || baseData.activite_principale;
//   }

//   return baseData;
// };

// const filterColumns = (data, columns) => {
//   if (!data || !columns || !columns.length) return data;

//   const filteredData = {};
//   columns.forEach((column) => {
//     if (AVAILABLE_COLUMNS.includes(column) && data.hasOwnProperty(column)) {
//       filteredData[column] = data[column];
//     }
//   });
//   return filteredData;
// };

// const fetchDataWithRetry = async (query, location, retryCount = 0) => {
//   try {
//     // First try Pappers
//     const pappersDataArray = await Pappers.enrich(query);
//     let googleData = null;

//     // If we have Pappers data and it's a SIREN search, try Google with company name
//     if (pappersDataArray?.length > 0 && /^\d+$/.test(query)) {
//       const companyName = pappersDataArray[0].nom_entreprise;
//       if (companyName) {
//         googleData = await Google.Enricher(companyName, location);
//       }
//     } else {
//       // If not a SIREN search or no Pappers data, try Google with original query
//       googleData = await Google.Enricher(query, location);
//     }

//     const enrichedData = mergeAndFormatData(googleData, pappersDataArray);

//     // Check if we have meaningful data
//     const hasData =
//       enrichedData &&
//       Object.values(enrichedData).some((value) => value !== null);

//     if (!hasData && retryCount < MAX_RETRIES) {
//       console.log(
//         `Attempt ${retryCount + 1}/${MAX_RETRIES}: No data found, retrying...`
//       );
//       await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
//       return fetchDataWithRetry(query, location, retryCount + 1);
//     }

//     return enrichedData;
//   } catch (error) {
//     if (retryCount < MAX_RETRIES) {
//       console.log(
//         `Attempt ${retryCount + 1}/${MAX_RETRIES}: Error occurred, retrying...`,
//         error
//       );
//       await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
//       return fetchDataWithRetry(query, location, retryCount + 1);
//     }
//     throw error;
//   }
// };

// const enrichDataFile = async (rows, id) => {
//   try {
//     const limit = pLimit(5); // 5 requêtes simultanées

//     const enrichedRows = await Promise.all(
//       rows.map((r) =>
//         limit(() =>
//           fetchDataWithRetry(r.company_name || r.phone || r.siren, r.location)
//         )
//       )
//     );

//     const csvOut = stringify(enrichedRows, { header: true });
//     const outDir = path.join(__dirname, "../../uploads/enriched");
//     if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

//     const outPath = path.join(outDir, `enriched_${id}.csv`);
//     fs.writeFileSync(outPath, csvOut);
//   } catch (err) {
//     console.error("Background enrichment failed:", err);
//   }
// };

// // Crée un job vide avec les données initiales
// const createEnrichmentJob = async (user_id, name, sources) => {
//   try {
//     const job = await EnrichJobs.create({
//       user_id,
//       name,
//       sources,
//       records: 0, // Initialement vide
//       enriched: 0, // Initialement vide
//       link: null, // Pas encore de lien
//     });

//     if (!job) {
//       console.log("Erreur lors de la création du job d'enrichissement");
//     }

//     return job;
//   } catch (error) {
//     console.log(
//       "Erreur lors de la création du job d'enrichissement :",
//       error.message
//     );
//   }
// };

// // Met à jour les données après enrichissement
// const updateEnrichmentJob = async (jobId, records, enriched, link) => {
//   try {
//     const job = await EnrichJobs.update(
//       { records, enriched, link },
//       { where: { id: jobId } }
//     );

//     if (!job) {
//       console.log("Erreur lors de la mise à jour du job d'enrichissement");
//     }

//     return job;
//   } catch (error) {
//     console.log("Erreur lors de la mise à jour du job :", error.message);
//   }
// };

// module.exports = {
//   enrichMapping: async (req, res) => {
//     try {
//       const { file } = req;
//       const meta = JSON.parse(req.body.meta);
//       const { mapping, expected_columns } = meta;

//       if (!file || !mapping) {
//         return res
//           .status(400)
//           .json({ error: "File and mapping are required in meta" });
//       }

//       const file_id = uuidv4();
//       const result = [];

//       // Lecture CSV et mappage
//       fs.createReadStream(file.path)
//         .pipe(csvParser())
//         .on("data", (row) => {
//           const mapped = {};
//           for (const [key, sourceHeader] of Object.entries(mapping)) {
//             mapped[key] = row[sourceHeader] || "";
//           }
//           result.push(mapped);
//         })
//         .on("end", async () => {
//           fs.unlinkSync(file.path); // ou cleanupTempFile(file.path);
//           // Conversion vers CSV avec les clés de mapping comme headers
//           const csvOut = stringify(result, {
//             header: true,
//             columns: Object.keys(mapping), // les clés comme headers
//           });

//           const outDir = path.join(__dirname, "../../uploads/mapped");
//           if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

//           const outPath = path.join(outDir, `mapped_${file_id}.csv`);
//           fs.writeFileSync(outPath, csvOut);
//           const sources = ["google", "pappers"];
//           // 1. Créer le job
//           const job = await createEnrichmentJob(user_id, name, sources); //name is the file name

//           // Lancement asynchrone
//           enrichDataFile(result, file_id).catch(console.error);

//           // 3. Mettre à jour le job avec les résultats
//           await updateEnrichmentJob(job.id, records, enriched, link);

//           return res.status(200).json({
//             status: "ok",
//             file_id,
//             path: outPath,
//             mapped_data: result,
//             expected_columns, // optionnel
//           });
//         });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   enrichData: async (req, res) => {
//     const { query, location, rows } = req.body;

//     try {
//       if (!query) {
//         return serverMessage(res, "BAD_REQUEST");
//       }

//       const requestedColumns = Array.isArray(rows) ? rows : [];
//       if (requestedColumns.length === 0) {
//         return res.status(400).json({
//           error: true,
//           status: 400,
//           message:
//             "No columns specified. Please specify columns in 'rows' array.",
//           availableColumns: AVAILABLE_COLUMNS,
//         });
//       }

//       const invalidColumns = requestedColumns.filter(
//         (col) => !AVAILABLE_COLUMNS.includes(col)
//       );
//       if (invalidColumns.length > 0) {
//         return res.status(400).json({
//           error: true,
//           status: 400,
//           message: "Invalid columns requested",
//           invalidColumns,
//           availableColumns: AVAILABLE_COLUMNS,
//         });
//       }

//       const enrichedData = await fetchDataWithRetry(query, location);

//       if (!enrichedData) {
//         return serverMessage(res, "NO_DATA_FOUND");
//       }

//       const filteredData = filterColumns(enrichedData, requestedColumns);

//       return res.status(200).json({
//         error: false,
//         status: 200,
//         message: "Data enriched successfully",
//         data: filteredData,
//       });
//     } catch (error) {
//       console.error("Error in enrichData:", error);
//       return serverMessage(res, "ENRICHMENT_FAILED");
//     }
//   },
//   enrichDataFile: async (req, res) => {
//     try {
//       const rows = await uploadFile(req);

//       const limit = pLimit(5); // 5 requêtes simultanées

//       // Each row must contain at least a 'query' and optional 'location'
//       const enrichedRows = await Promise.all(
//         rows.map((r) => limit(() => fetchDataWithRetry(r.query, r.location)))
//       );
//       // Generate CSV
//       const csvOut = stringify(enrichedRows, { header: true });
//       const outDir = path.join(__dirname, "../../uploads/enriched");
//       if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
//       const outPath = path.join(outDir, `enriched_${Date.now()}.csv`);
//       fs.writeFileSync(outPath, csvOut);
//       // send and cleanup
//       res.download(outPath, (err) => {
//         if (err) console.error("Download error:", err);
//         cleanupTempFile(outPath);
//       });
//     } catch (err) {
//       console.error(err);
//       return serverMessage(res, "ENRICHMENT_FAILED");
//     }
//   },
// };
