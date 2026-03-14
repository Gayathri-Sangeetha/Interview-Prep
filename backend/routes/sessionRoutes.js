const express = require("express");
const router = express.Router();

const {
  createSession,
  getSessions,
  getSessionById,
  deleteSession,
} = require("../controllers/sessionController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSession);
router.get("/", protect, getSessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

module.exports = router;