// services/ttsService.js
const fetch = require('node-fetch');
const { ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID } = require('../config.js');


module.exports.generateVoicemailAudio = async (text) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream?output_format=ulaw_8000`;
  const options = {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      accept: 'audio/wav'
    },
    body: JSON.stringify({ text })
  };

  const response = await fetch(url, options);
  if (response.ok) {
    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
  } else {
    throw new Error('ElevenLabs TTS error: ' + response.status);
  }
}
