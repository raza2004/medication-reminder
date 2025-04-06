// services/sttService.js
const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');
const fs = require('fs');

class STTService {
  constructor() {
    this.deepgramClient = createClient("675386911aa6480e52d6db84408f3582c1323f7f");
    this.connections = new Map();
    this.transcripts = new Map();
  }

  async initStream(streamSid) {
    try {
      console.log(`Initializing stream ${streamSid}...`);
      
      // New format: include language and punctuate; remove deprecated keys.
      const connection = this.deepgramClient.transcription.live({
        model: 'nova-3-phonecall',
        language: 'en-US',
        punctuate: true,
        interim_results: true,
        endpointing: 500
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log(`✅ Deepgram connected: ${streamSid}`);
        this.connections.set(streamSid, connection);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          this.transcripts.set(streamSid, transcript);
          console.log(`📝 [${streamSid} Interim]: ${transcript}`);
        }
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(`🔥 Deepgram error (${streamSid}):`, err);
        this.cleanupStream(streamSid);
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log(`🚪 Connection closed: ${streamSid}`);
        this.cleanupStream(streamSid);
      });

      return connection;
    } catch (error) {
      console.error('Stream init failed:', error);
      throw error;
    }
  }

  async processFile(filePath) {
    const streamSid = `file_${Date.now()}`;
    let connection;
    
    try {
      connection = await this.initStream(streamSid);
      const audioBuffer = fs.readFileSync(filePath);

      return new Promise((resolve, reject) => {
        // Send audio in chunks (e.g., 200ms chunks)
        const chunkSize = 3200;
        let offset = 0;

        const sendNextChunk = () => {
          if (offset >= audioBuffer.length) {
            connection.finish();
            return;
          }
          const chunk = audioBuffer.slice(offset, offset + chunkSize);
          offset += chunkSize;
          try {
            connection.send(chunk);
            setTimeout(sendNextChunk, 200);
          } catch (err) {
            reject(err);
          }
        };

        sendNextChunk();

        connection.on(LiveTranscriptionEvents.Close, () => {
          resolve(this.transcripts.get(streamSid) || '');
        });
      });
    } finally {
      this.cleanupStream(streamSid);
    }
  }

  cleanupStream(streamSid) {
    if (this.connections.has(streamSid)) {
      try {
        this.connections.get(streamSid).finish();
      } catch (e) {
        // Ignore errors during cleanup.
      }
      this.connections.delete(streamSid);
      this.transcripts.delete(streamSid);
    }
  }
}

module.exports = new STTService();