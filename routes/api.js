// routes/api.js
const express = require('express');
const { triggerCall } = require('../services/twilioService.js');

const router = express.Router();

router.post('/trigger-call', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const callData = await triggerCall(phoneNumber);
    console.log(`Call initiated: SID ${callData.sid}, Status: ${callData.status}`);
    res.json({ success: true, callData });
  } catch (error) {
    console.error('Error triggering call:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

