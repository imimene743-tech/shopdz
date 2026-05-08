const express = require("express");
const router = express.Router();
const wilayaController = require("../controllers/wilayaController");

router.get("/", wilayaController.getWilayas);

module.exports = router;
