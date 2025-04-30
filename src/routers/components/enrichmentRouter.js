const router = require("express").Router();
const enrichController = require("../../controllers/components/enrichsmentController");
const multer = require("multer");
const path = require("path");
const { serverMessage } = require("../../utils");

const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
});

router
  .post("/enrich", enrichController.enrichData)
  .post(
    "/enrich/mapping",
    upload.single("file"),
    enrichController.enrichMapping
  )
  .post("/enrich/get-all", enrichController.getAllEnrichJobs)
  .get("/enrich/:fileId", enrichController.downloadFile);
// .post("/enrich/file", upload.single("file"), enrichController.enrichDataFile);

module.exports = router;
