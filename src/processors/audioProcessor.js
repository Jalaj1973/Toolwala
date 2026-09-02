import { readFileAsArrayBuffer } from '../utils/fileUtils';

/**
 * Audio Processor using Web Audio API (AudioContext)
 * Processes audio entirely client-side inside the browser.
 */

// Helper to encode AudioBuffer to a downloadable WAV File Blob
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + dataLength, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, dataLength, true);

  // Write PCM audio data
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][i];
      // Clamp values between -1 and 1
      sample = Math.max(-1, Math.min(1, sample));
      // Convert to 16-bit signed integer
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Decode audio file to AudioBuffer
 */
async function decodeAudioFile(file, onProgress) {
  if (onProgress) onProgress(20, 'Reading audio data...');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (onProgress) onProgress(50, 'Decoding audio track...');
  const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  audioCtx.close();
  return decodedBuffer;
}

/**
 * Trim Audio (Start Time to End Time in seconds)
 */
export async function trimAudio(file, startTime = 0, endTime = 10, onProgress) {
  const buffer = await decodeAudioFile(file, onProgress);
  if (onProgress) onProgress(70, 'Trimming audio segment...');

  const sampleRate = buffer.sampleRate;
  const numChannels = buffer.numberOfChannels;

  const startSample = Math.max(0, Math.floor(startTime * sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(endTime * sampleRate));
  const newLength = Math.max(1, endSample - startSample);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const trimmedBuffer = audioCtx.createBuffer(numChannels, newLength, sampleRate);

  for (let i = 0; i < numChannels; i++) {
    const channelData = buffer.getChannelData(i);
    const trimmedData = trimmedBuffer.getChannelData(i);
    for (let j = 0; j < newLength; j++) {
      trimmedData[j] = channelData[startSample + j];
    }
  }

  audioCtx.close();
  if (onProgress) onProgress(90, 'Encoding trimmed WAV file...');
  const wavBlob = audioBufferToWav(trimmedBuffer);
  if (onProgress) onProgress(100, 'Done!');
  return wavBlob;
}

/**
 * Adjust Audio Volume (Volume multiplier e.g. 0.5 for 50%, 2.0 for 200%)
 */
export async function adjustAudioVolume(file, volumeFactor = 1.5, onProgress) {
  const buffer = await decodeAudioFile(file, onProgress);
  if (onProgress) onProgress(70, 'Adjusting volume levels...');

  const numChannels = buffer.numberOfChannels;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const newBuffer = audioCtx.createBuffer(numChannels, buffer.length, buffer.sampleRate);

  for (let i = 0; i < numChannels; i++) {
    const srcData = buffer.getChannelData(i);
    const destData = newBuffer.getChannelData(i);
    for (let j = 0; j < buffer.length; j++) {
      destData[j] = srcData[j] * volumeFactor;
    }
  }

  audioCtx.close();
  if (onProgress) onProgress(90, 'Encoding WAV audio...');
  const wavBlob = audioBufferToWav(newBuffer);
  if (onProgress) onProgress(100, 'Done!');
  return wavBlob;
}

/**
 * Change Audio Playback Speed
 */
export async function changeAudioSpeed(file, speedFactor = 1.25, onProgress) {
  const buffer = await decodeAudioFile(file, onProgress);
  if (onProgress) onProgress(70, 'Resampling audio speed...');

  const numChannels = buffer.numberOfChannels;
  const newSampleRate = Math.round(buffer.sampleRate * speedFactor);
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const newBuffer = audioCtx.createBuffer(numChannels, buffer.length, newSampleRate);

  for (let i = 0; i < numChannels; i++) {
    newBuffer.copyToChannel(buffer.getChannelData(i), i);
  }

  audioCtx.close();
  if (onProgress) onProgress(90, 'Encoding WAV audio...');
  const wavBlob = audioBufferToWav(newBuffer);
  if (onProgress) onProgress(100, 'Done!');
  return wavBlob;
}

/**
 * Convert Audio format to WAV
 */
export async function convertAudioToWav(file, onProgress) {
  const buffer = await decodeAudioFile(file, onProgress);
  if (onProgress) onProgress(80, 'Encoding audio to WAV...');
  const wavBlob = audioBufferToWav(buffer);
  if (onProgress) onProgress(100, 'Done!');
  return wavBlob;
}

/**
 * Merge multiple audio files into a single WAV track
 */
export async function mergeAudioFiles(files, onProgress) {
  if (onProgress) onProgress(10, 'Reading audio tracks...');
  const buffers = [];

  for (let i = 0; i < files.length; i++) {
    const buf = await decodeAudioFile(files[i], (pct, msg) => {
      if (onProgress) onProgress(10 + Math.round((i / files.length) * 60), msg);
    });
    buffers.push(buf);
  }

  if (buffers.length === 0) throw new Error('No valid audio files provided');

  if (onProgress) onProgress(75, 'Combining audio tracks...');
  const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
  const sampleRate = buffers[0].sampleRate;
  const numChannels = buffers[0].numberOfChannels;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const mergedBuffer = audioCtx.createBuffer(numChannels, totalLength, sampleRate);

  let currentOffset = 0;
  for (const buf of buffers) {
    for (let ch = 0; ch < numChannels; ch++) {
      const src = buf.getChannelData(Math.min(ch, buf.numberOfChannels - 1));
      const dest = mergedBuffer.getChannelData(ch);
      for (let i = 0; i < buf.length; i++) {
        dest[currentOffset + i] = src[i];
      }
    }
    currentOffset += buf.length;
  }

  audioCtx.close();
  if (onProgress) onProgress(90, 'Encoding merged WAV file...');
  const wavBlob = audioBufferToWav(mergedBuffer);
  if (onProgress) onProgress(100, 'Done!');
  return wavBlob;
}
