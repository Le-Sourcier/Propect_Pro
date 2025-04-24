const express = require("express");
const router = express.Router();
const { authorize } = require("../middlewares/authMiddleware");

router.use("/user", authorize, require("./components/userRouter"));
router.use("/job", require("./components/jobRouter"));

module.exports = router;
