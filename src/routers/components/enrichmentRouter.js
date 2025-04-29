const router = require("express").Router();
const enrichController = require("../../controllers/components/enrichsmentController");
const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
});

router
  .post("/enrich", enrichController.enrichData)
  .post("/enrich/file", upload.single("file"), enrichController.enrichDataFile);

module.exports = router;
