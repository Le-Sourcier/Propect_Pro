const { GoogleScraper } = require("./../../functions");
const { scraping_jobs: Jobs, Users } = require("../../models");
const { serverMessage } = require("../../utils");
const jobEmitter = require("../../events/jobEvent");

module.exports = {
  // Create new job
  createJob: async (req, res) => {
    try {
      const { user_id, source, query, location, results } = req.body;
      console.log("createJob", req.body);

      const userExists = await Users.findByPk(user_id);
      if (!userExists) {
        return serverMessage(res, "USER_NOT_FOUND");
      }

      const job = await Jobs.create({
        user_id,
        source,
        query,
        location,
        results,
      });
      const jobPlain = job.get({ plain: true });
      const data = {
        id: jobPlain.id,
        source: jobPlain.source,
        query: jobPlain.query,
        location: jobPlain.location,
        results: jobPlain.results,
        status: jobPlain.status,
        createdAt: jobPlain.createdAt,
      };

      return serverMessage(res, "JOB_CREATED", data);
    } catch (error) {
      console.error(error);
      return serverMessage(res);
    }
  },

  // Get all jobs
  getAllJobs: async (req, res) => {
    const { user_id } = req.query;
    try {
      const userExists = await Users.findByPk(user_id);
      if (!userExists) {
        return serverMessage(res, "UNAUTHORIZED_ACCESS");
      }

      const jobs = await Jobs.findAll({ where: { user_id } });
      if (!jobs || jobs.length < 0) {
        return serverMessage(res, "NO_JOBS_FOUND");
      }
      res.status(200).json(jobs);
    } catch (error) {
      // res.status(500).json({ error: "Unable to fetch jobs" });
      console.error("UNABLE_TO_FETCH_JOBS,", error);
      return serverMessage(res);
    }
  },

  // Get single job by ID
  getJobWithDetails: async (req, res) => {
    try {
      const job = await Jobs.findAll({
        where: { user_id: req.params.id },
      });

      if (!job) {
        // return res.status(404).json({ error: "Job not found" });
        return serverMessage(res, "JOB_NOT_FOUND");
      }

      return serverMessage(res, "JOB_FETCHED", job);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job" });
      // console.error("FAILED_TO_GET_JOB,", error);
      return serverMessage(res, "FAILED_TO_GET_JOB");
    }
  },

  // Update job
  updateJob: async (req, res) => {
    try {
      const jobId = req.params.id;
      const updates = req.body;

      const job = await Jobs.findByPk(jobId);
      if (!job) {
        return serverMessage(res, "JOB_NOT_FOUND");
      }

      // Préserver les champs non modifiables
      updates.user_id = job.user_id;
      updates.source = job.source;
      updates.query = job.query;
      updates.location = job.location;
      updates.results = job.results;

      const statusWillChangeToRunning =
        updates.status === "running" && job.status !== "running";

      await job.update(updates); // ⬅️ Mettre à jour AVANT le scraping

      // Déclencher le scraping en arrière-plan
      if (statusWillChangeToRunning) {
        console.log("Job is starting, launching GoogleScraper...");

        GoogleScraper(job.query, job.location)
          .then(async (results) => {
            console.log("Scraping completed for job:", job.id);
            await job.update({
              status: "completed",
              results: results.length,
            });
          })
          .catch(async (err) => {
            console.error("Scraping failed for job:", job.id, err);
            await job.update({
              status: "failed",
            });
          });
      }

      return serverMessage(res, "JOB_UPDATED", job);
    } catch (error) {
      return serverMessage(res);
    }
  },

  // Delete job
  deleteJob: async (req, res) => {
    try {
      const job = await Jobs.findByPk(req.params.id);
      if (!job) {
        return serverMessage(res, "JOB_NOT_FOUND");
      }

      await job.destroy();
      return serverMessage(res, "JOB_DELETED");
    } catch (error) {
      return serverMessage(res);
    }
  },
};
