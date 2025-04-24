const router = require("express").Router();
const jobController = require("../../controllers/components/jobsController");
const jobEmitter = require("../../events/jobEvent");

router
  .post("/create", jobController.createJob) // Create new scraping job
  .get("/all", jobController.getAllJobs) // Get all scraping jobs
  .get("/get/:id", jobController.getJobWithDetails) // Get single job with user
  .put("/update/:id", jobController.updateJob) // Update job
  .delete("/delete/:id", jobController.deleteJob) // Delete job
  .get("/:id/events", (req, res) => {
    const jobId = req.params.id;

    // Headers SSE
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders(); // pour certains middlewares

    // Émet l’état actuel du job à l’ouverture
    (async () => {
      const job = await require("../../models").scraping_jobs.findByPk(jobId);
      if (job) {
        res.write(
          `data: ${JSON.stringify({
            status: job.status,
            results: job.results,
          })}\n\n`
        );
      }
    })();

    // Écouteur SSE pour ce job
    const onUpdate = (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };
    jobEmitter.on(jobId, onUpdate);

    // Nettoyage à la fermeture de connexion
    req.on("close", () => {
      jobEmitter.removeListener(jobId, onUpdate);
      res.end();
    });
  });

module.exports = router;
