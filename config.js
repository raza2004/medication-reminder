// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  FROM_NUMBER: process.env.FROM_NUMBER,
  SERVER_DOMAIN: process.env.SERVER_DOMAIN,
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
  BATCH_SIZE: 10,
  API_DELAY: 100,
  PORT: process.env.PORT || 3000,
   // Audio Processing
   BATCH_SIZE: parseInt(process.env.BATCH_SIZE) || 10,
   API_DELAY: parseInt(process.env.API_DELAY) || 100,
   
   // Audio Formats
   AUDIO_SAMPLE_RATE: 16000,
   AUDIO_CHANNELS: 1
};
