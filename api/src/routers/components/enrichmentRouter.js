const router = require("express").Router();
const enrichController = require("../../controllers/components/enrichsmentController");
const multer = require("multer");
const path = require("path");

const upload = multer({
    dest: path.join(__dirname, "../../uploads"),
});

router
    .post("/enrich/mapping", upload.single("file"), enrichController.enrichFile)
    .post("/enrich/get-all", enrichController.getAllJobs)
    .get("/enrich/:fileId", enrichController.downloadFile);

module.exports = router;
