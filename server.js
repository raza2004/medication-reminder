const express = require('express');
const expressWs = require('express-ws');
const sttService = require('./services/sttService');
const dotenv = require('dotenv');

dotenv.config();
const { app } = expressWs(express());
const port = process.env.PORT || 3000;

app.ws('/media', (ws, req) => {
  let streamSid;

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      
      switch(data.event) {
        case 'start':
          streamSid = data.streamSid;
          console.log(`Stream started: ${streamSid}`);
          break;

        case 'media':
          if (data.media?.payload) {
            const audioBuffer = Buffer.from(data.media.payload, 'base64');
            sttService.processAudio(streamSid, audioBuffer);
          }
          break;

        case 'stop':
          console.log(`Stream ended: ${streamSid}`);
          sttService.closeStream(streamSid);
          const finalTranscript = sttService.getTranscript(streamSid);
          console.log(`Final transcript [${streamSid}]: ${finalTranscript}`);
          break;
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});