const express = require("express");
const router = express.Router();

const {
  togglePin,
  getPinnedQuestions,
  getAIExplanation,
} = require("../controllers/questionController");

const { protect } = require("../middleware/authMiddleware");

router.get("/pinned", protect, getPinnedQuestions);
router.patch("/:id/pin", protect, togglePin);
router.post("/explain", protect, getAIExplanation);

module.exports = router;