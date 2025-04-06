// test/sttService.test.js
const nock = require('nock');
const { processAudioStream } = require('../services/sttService');
const { DEEPGRAM_API_KEY } = require('../config');

describe('processAudioStream', () => {
  // Sample audio payload - can be any Buffer (for testing purposes, even an empty Buffer)
  const fakeAudioBuffer = Buffer.from('fake-audio-data');

  it('should return a transcript from the mocked Deepgram API', async () => {
    // Set up nock to intercept the HTTP POST request
    nock('https://api.deepgram.com')
      .post('/v1/listen', fakeAudioBuffer)
      .query({ model: 'nova-3', smart_format: 'true' })
      .matchHeader('Authorization', `Token ${DEEPGRAM_API_KEY}`)
      .matchHeader('Content-Type', 'audio/wav')
      .reply(200, {
        transcript: "This is a fake transcript for testing."
      });

    const transcript = await processAudioStream(fakeAudioBuffer);
    expect(transcript).toBe("This is a fake transcript for testing.");
  });

  it('should handle errors gracefully', async () => {
    // Simulate a 400 error response from Deepgram
    nock('https://api.deepgram.com')
      .post('/v1/listen', fakeAudioBuffer)
      .query({ model: 'nova-3', smart_format: 'true' })
      .reply(400, { error: "Bad Request" });

    const transcript = await processAudioStream(fakeAudioBuffer);
    expect(transcript).toBe("");
  });
});
