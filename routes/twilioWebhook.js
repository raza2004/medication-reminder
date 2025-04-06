// routes/twilioWebhook.js

const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const router = express.Router();


router.post('/incoming', (req, res) => {
  const response = new VoiceResponse();
  response.say(
    'Hello, this is a reminder from your healthcare provider to confirm your medications for the day. Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.',
    { voice: 'Rachel', language: 'en-US' }
  );
  const connect = response.connect();
  connect.stream({ url: `wss://${process.env.SERVER_DOMAIN}/media` });
  
  res.type('text/xml');
  res.send(response.toString());
});

module.exports = router;

