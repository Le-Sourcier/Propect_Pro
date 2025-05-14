const { Google, Pappers } = require("../../functions");
const {
    scraping_jobs: Jobs,
    scraping_job_results: jobResults,
    Users,
} = require("../../models");
const db = require("../../models");
const { serverMessage } = require("../../utils");
const dayjs = require("dayjs");

module.exports = {
    // Create new job
    createJob: async (req, res) => {
        try {
            const { user_id, source, query, location, results, limite } =
                req.body;

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
                limite,
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
        const id = req.params.id;
        try {
            const user = await Users.findByPk(id);
            if (!user) {
                return serverMessage(res, "UNAUTHORIZED_ACCESS");
            }

            const jobs = await Jobs.findAll({ where: { user_id: user.id } });
            if (!jobs || jobs.length <= 0) {
                return serverMessage(res, "NO_JOBS_FOUND");
            }
            const data = jobs.map((job) => {
                const plainJob = job.get({ plain: true });
                delete plainJob.user_id;

                const data = {
                    id: plainJob.id,
                    name: plainJob.query,
                    source: plainJob.source,
                    location: plainJob.location,
                    status: plainJob.status,
                    date: dayjs(plainJob.createdAt).format(
                        "ddd MMM YYYY HH:mm"
                    ),
                };
                return data;
            });

            return serverMessage(res, "SUCCESS", data);
            // res.status(200).json(jobs);
        } catch (error) {
            // res.status(500).json({ error: "Unable to fetch jobs" });
            console.error("UNABLE_TO_FETCH_JOBS,", error);
            return serverMessage(res);
        }
    },

    // Get all job created with user ID
    getJobByList: async (req, res) => {
        try {
            const job = await Jobs.findAll({
                where: { user_id: req.params.id },
            });

            if (!job) {
                return serverMessage(res, "JOB_NOT_FOUND");
            }

            const data = job.map((j) => {
                const plainJob = j.get({ plain: true });
                return {
                    ...plainJob,
                    createdAt: dayjs(plainJob.createdAt).format(
                        "ddd MMM YYYY HH:mm"
                    ),
                };
            });

            return serverMessage(res, "JOB_FETCHED", data);
        } catch (error) {
            res.status(500).json({ error: "Failed to get job" });
            console.error("FAILED_TO_GET_JOB,", error);
            return serverMessage(res, "FAILED_TO_GET_JOB");
        }
    },

    // Get single job by ID
    getJobWithDetails: async (req, res) => {
        try {
            const job = await jobResults.findByPk(req.params.id);

            if (!job) {
                return serverMessage(res, "JOB_NOT_FOUND");
            }

            return serverMessage(res, "JOB_FETCHED", job);
        } catch (error) {
            return serverMessage(res, "FAILED_TO_GET_JOB");
        }
    },

    // Start job
    startJob: async (req, res) => {
        // const transaction = await db.sequelize.transaction();
        try {
            const jobId = req.params.id;
            const updates = req.body;
            const io = req.app.get("io");

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
                console.log("Job is starting, launching Google.Scraper...");

                let JobSource = job.source;
                let JobType;

                if (JobSource === "google-maps") {
                    JobType = Google.Scraper(
                        job.query,
                        job.location,
                        job.limite
                    );
                } else if (JobSource === "pappers") {
                    JobType = Pappers.scraper(job.query, job.limite);
                }

                JobType.then(async (results) => {
                    console.log("Scraping completed for job:", job.id);
                    await job.update({
                        status: "completed",
                        results:
                            JobSource === "pappers"
                                ? results.entreprises.length
                                : results.length,
                    });
                    console.log("Job status updated to completed");

                    await jobResults.create(
                        {
                            id: job.id,
                            result:
                                JobSource === "pappers"
                                    ? results.entreprises
                                    : results,
                        }
                        // { transaction }
                    );

                    io.emit("jobStatusUpdate", {
                        status: job.status,
                        name: "scraping_" + job.query.replaceAll(" ", "_"),
                    });
                }).catch(async (err) => {
                    console.error("Scraping failed for job:", job.id, err);
                    await job.update({
                        status: "failed",
                    });
                    io.emit("jobStatusUpdate", {
                        status: "failed",
                        name: "scraping_" + job.query.replaceAll(" ", "_"),
                    });
                });
            }
            // await transaction.commit();
            return serverMessage(res, "JOB_UPDATED", job);
        } catch (error) {
            // await transaction.rollback();
            return serverMessage(res);
        }
    },

    // Delete job
    deleteJob: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const jobId = req.params.id;
            if (!jobId) return serverMessage(res, "JOB_NOT_FOUND");

            const job = await Jobs.findByPk(jobId);
            if (!job) {
                return serverMessage(res, "JOB_NOT_FOUND");
            }

            await job.destroy();
            await transaction.commit();

            return serverMessage(res, "JOB_DELETED");
        } catch (error) {
            await transaction.rollback();
            console.error("UNABLE_TO_DELETE_JOB,", error);
            // res.status(500).json({ error: "Unable to delete job" });
            return serverMessage(res);
        }
    },
};
