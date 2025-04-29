const router = require("express").Router();
const enrichController = require("../../controllers/components/enrichsmentController");
router
  .post("/enrich", enrichController.enrichData)
  .post("/enrich/file", enrichController.enrichData);

module.exports = router;
