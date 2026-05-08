const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// ajouter review
router.post("/", reviewController.addReview);

// voir reviews produit
router.get("/:productId", reviewController.getReviewsByProduct);

module.exports = router;