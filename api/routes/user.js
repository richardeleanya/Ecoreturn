/**
 * User API routes (excerpt)
 * - Delete account endpoint: anonymizes PII, deactivates wallet, retains minimal transaction records (MVP).
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wallet = require('../models/Wallet');

// DELETE /api/v1/user/delete
router.delete('/delete', async (req, res) => {
  try {
    const userId = req.user.id; // JWT auth required
    // 1. Anonymize user record
    await User.findByIdAndUpdate(userId, {
      email: `deleted+${userId}@ecoreturn.com`,
      phone: null,
      name: null,
      isDeleted: true,
      // Add a field for deletion timestamp
      deletedAt: new Date(),
    });
    // 2. Deactivate wallet (keep transaction/audit history for regulatory)
    await Wallet.updateOne({ userId }, { active: false });
    // 3. Return success
    res.json({ success: true, message: "Account deleted and personal data anonymized." });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete account." });
  }
});

/**
 * Notes:
 * - All future login tokens for this user are invalidated on logout.
 * - Transactional records (returns, payouts) retain only anonymized userId for audit/fraud purposes.
 * - Data retention policy: user PII is wiped, but operational data is retained for regulatory, anti-fraud, and financial audit.
 */

module.exports = router;