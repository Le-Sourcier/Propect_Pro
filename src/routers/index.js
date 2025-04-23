const express = require("express");
const router = express.Router();

const userRouter = require("./components/userRouter");

router.use("/", userRouter); // will be accessible at /api/*

module.exports = router;
