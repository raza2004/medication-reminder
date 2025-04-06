// localTester.js
const fs = require('fs');
const sttService = require('./services/sttService');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const inputPath = process.argv[2] || './test_audio.mp3';
const tempPath = './_temp_converted.wav';

async function convertAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Converting ${inputPath} to Deepgram-compatible format...`);
    ffmpeg(inputPath)
      .setFfmpegPath(ffmpegPath)
      .audioFrequency(16000)
      .audioChannels(1)
      .outputOptions('-acodec pcm_s16le')
      .format('wav')
      .on('end', () => {
        console.log(`✅ Conversion saved to ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error('🔥 Conversion failed:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

async function testLocalAudio(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`📂 File not found: ${filePath}`);
    }
    await convertAudio(filePath, tempPath);
    const stats = fs.statSync(tempPath);
    console.log(`📏 Converted file size: ${(stats.size / 1024).toFixed(1)} KB`);
    if (stats.size < 1024) {
      throw new Error('❌ Invalid converted file - too small');
    }
    console.log('🎤 Starting transcription...');
    const transcript = await sttService.processFile(tempPath);
    console.log('\n💬 FINAL TRANSCRIPT:');
    console.log(transcript || '(No text detected)');
  } catch (error) {
    console.error('\n🚨 TEST FAILED:', error.message);
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
      console.log('🧹 Cleaned temporary files');
    }
  }
}

testLocalAudio(inputPath);
