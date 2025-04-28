const { Google, Pappers } = require("../../functions");
const { scraping_jobs: Jobs, Users } = require("../../models");
const db = require("../../models");
const { serverMessage } = require("../../utils");

module.exports = {
  // Enrich data from CSV, xlsx, or xls file
  enrichData: async (req, res) => {
    const {
      entreprise_name,
      siren_number,
      email_address,
      full_name,
      zip_code,
      country,
      actities_sectorial,
      siret_number,
      domain,
      phone_number,
      address,
      city,
      naf_code,
      employees_count,
    } = req.body;

    try {
      let enrichDataGoogle = null;
      let enrichDataPappers = null;
      let location = "";

      // Construction de la localisation pour Google
      if (city && country) {
        location = `${city}, ${country}`;
      } else if (city) {
        location = city;
      } else if (country) {
        location = country;
      }

      // Appel aux deux sources d'enrichissement en parallèle
      const googlePromise = Google.Enricher(entreprise_name, location);
      const pappersPromise = Pappers.enrich(entreprise_name);

      // Attendre les deux résultats
      [enrichDataGoogle, enrichDataPappers] = await Promise.all([
        googlePromise,
        pappersPromise,
      ]);

      // Logs pour débogage
      console.log("Google Data:", enrichDataGoogle);
      console.log("Pappers Data:", enrichDataPappers);

      // Si aucune donnée n'est trouvée, renvoyer une erreur
      if (!enrichDataGoogle && !enrichDataPappers) {
        return serverMessage(res, "NO_DATA_FOUND");
      }

      // Fusionner les résultats des deux sources pour une donnée plus complète
      const enrichedFields = {};

      // Ajouter uniquement les champs qui existent dans les données récupérées
      if (
        entreprise_name ||
        enrichDataGoogle?.title ||
        enrichDataPappers?.nom_entreprise
      ) {
        enrichedFields.company_name =
          entreprise_name ||
          enrichDataGoogle?.title ||
          enrichDataPappers?.nom_entreprise;
      }

      if (
        siret_number ||
        enrichDataGoogle?.siret ||
        enrichDataPappers?.siege?.siret_formate
      ) {
        enrichedFields.siret =
          siret_number ||
          enrichDataGoogle?.siret ||
          enrichDataPappers?.siege?.siret_formate;
      }

      if (siren_number || enrichDataGoogle?.siren || enrichDataPappers?.siren) {
        enrichedFields.siren =
          siren_number || enrichDataGoogle?.siren || enrichDataPappers?.siren;
      }

      if (domain || enrichDataGoogle?.website || enrichDataPappers?.domain) {
        enrichedFields.domain =
          domain || enrichDataGoogle?.website || enrichDataPappers?.domain;
      }

      if (
        email_address ||
        enrichDataGoogle?.email ||
        enrichDataPappers?.email
      ) {
        enrichedFields.email =
          email_address || enrichDataGoogle?.email || enrichDataPappers?.email;
      }

      if (
        phone_number ||
        enrichDataGoogle?.phone ||
        enrichDataPappers?.siege?.phone
      ) {
        enrichedFields.phone =
          phone_number ||
          enrichDataGoogle?.phone ||
          enrichDataPappers?.siege?.phone;
      }

      if (
        full_name ||
        enrichDataGoogle?.title ||
        enrichDataPappers?.full_name
      ) {
        enrichedFields.full_name =
          full_name ||
          (enrichDataGoogle?.title && enrichDataGoogle?.title !== "Résultats"
            ? enrichDataGoogle?.title
            : null) ||
          enrichDataPappers?.full_name;
      }

      if (
        address ||
        enrichDataGoogle?.address ||
        enrichDataPappers?.siege?.adresse_ligne_1
      ) {
        enrichedFields.address =
          address ||
          enrichDataGoogle?.address ||
          enrichDataPappers?.siege?.adresse_ligne_1;
      }

      if (
        zip_code ||
        enrichDataGoogle?.codePlus ||
        enrichDataPappers?.siege?.code_postal
      ) {
        enrichedFields.zip_code =
          zip_code ||
          enrichDataGoogle?.codePlus ||
          enrichDataPappers?.siege?.code_postal;
      }

      if (
        city ||
        enrichDataGoogle?.codePlus ||
        enrichDataPappers?.siege?.ville
      ) {
        enrichedFields.city =
          city || enrichDataGoogle?.codePlus || enrichDataPappers?.siege?.ville;
      }

      if (
        country ||
        enrichDataGoogle?.codePlus ||
        enrichDataPappers?.siege?.pays
      ) {
        enrichedFields.country =
          country ||
          enrichDataGoogle?.codePlus ||
          enrichDataPappers?.siege?.pays;
      }

      if (naf_code || enrichDataGoogle?.type || enrichDataPappers?.code_naf) {
        enrichedFields.naf_code =
          naf_code || enrichDataGoogle?.type || enrichDataPappers?.code_naf;
      }

      if (
        actities_sectorial ||
        enrichDataGoogle?.type ||
        enrichDataPappers?.categorie_juridique
      ) {
        enrichedFields.sector =
          actities_sectorial ||
          enrichDataGoogle?.type ||
          enrichDataPappers?.categorie_juridique;
      }

      if (
        employees_count ||
        enrichDataGoogle?.employee_count ||
        enrichDataPappers?.employee_count
      ) {
        enrichedFields.employee_count =
          employees_count ||
          enrichDataGoogle?.employee_count ||
          enrichDataPappers?.employee_count;
      }

      // Renvoyer uniquement les champs qui ont été enrichis
      return res.status(200).json({
        message: "Data enriched successfully",
        data: await googlePromise,
      });
    } catch (error) {
      console.error("Error in enrichData:", error);
      return serverMessage(res, "ENRICHMENT_FAILED");
    }
  },
};
