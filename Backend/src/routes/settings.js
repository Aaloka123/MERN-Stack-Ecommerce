import express from "express";
import Setting from "../models/Setting.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET store status (public – used by user site)
router.get("/store-status", async (_req, res) => {
  try {
    const doc = await Setting.findOne().lean();
    const storeClosed = doc?.storeClosed === true;
    return res.json({ storeClosed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ storeClosed: false });
  }
});

// PUT store status (admin – set store open/closed)
router.put("/store-status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { storeClosed } = req.body;
    const value = storeClosed === true;
    await Setting.findOneAndUpdate(
      {},
      { $set: { storeClosed: value } },
      { upsert: true, new: true }
    );
    return res.json({ success: true, storeClosed: value });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to update store status" });
  }
});

export default router;
