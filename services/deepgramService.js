// services/deepgramService.js
const { createClient } = require('@deepgram/sdk');

class DeepgramService {
  constructor() {
    // Map to store active Deepgram live transcription sockets by streamSid
    this.sockets = new Map();
  }
  
  createStream(streamSid) {
    // Create a new Deepgram client using the v3 API
    const dgClient = createClient(process.env.DEEPGRAM_API_KEY);
    
    // Create a live transcription socket using the new v3 options.
    // Notice that we no longer pass encoding, sampleRate, or channels.
    const socket = dgClient.transcription.live({
      punctuate: true,
      interim_results: true,
      language: 'en-US',
      model: 'nova-3'
    });

    socket.on('open', () => {
      console.log(`Deepgram socket opened for stream ${streamSid}`);
    });
    
    socket.on('message', (message) => {
      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        console.error('Error parsing Deepgram message:', err);
        return;
      }
      if (data && data.channel && data.channel.alternatives && data.channel.alternatives[0]) {
        const transcript = data.channel.alternatives[0].transcript || '';
        console.log(`Transcript for ${streamSid}:`, transcript);
      }
    });
    
    socket.on('error', (err) => {
      console.error(`Deepgram socket error for stream ${streamSid}:`, err);
    });
    
    this.sockets.set(streamSid, socket);
  }
  
  sendAudio(streamSid, audioBuffer) {
    const socket = this.sockets.get(streamSid);
    if (socket && socket.readyState === socket.OPEN) {
      socket.send(audioBuffer);
    } else {
      console.error(`Deepgram socket for stream ${streamSid} is not open.`);
    }
  }
  
  closeStream(streamSid) {
    const socket = this.sockets.get(streamSid);
    if (socket) {
      socket.close();
      this.sockets.delete(streamSid);
      console.log(`Deepgram socket closed for stream ${streamSid}`);
    }
  }
}

module.exports = new DeepgramService();
