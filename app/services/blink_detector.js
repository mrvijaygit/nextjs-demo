const ffmpeg = require('fluent-ffmpeg');
const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
const path = require('path');
const { promises: fs } = require('fs');

// Ensure TextEncoder and TextDecoder are available globally
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configure canvas to use the Node environment
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_URL = "/Users/grootan/Goals/demo-app/public/models";

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
}

function calculateEyeAspectRatio(eye) {
  const A = Math.hypot(eye[1]._x - eye[5]._x, eye[1]._y - eye[5]._y);
  const B = Math.hypot(eye[2]._x - eye[4]._x, eye[2]._y - eye[4]._y);
  const C = Math.hypot(eye[0]._x - eye[3]._x, eye[0]._y - eye[3]._y);
  const ear = (A + B) / (2.0 * C);
  return ear;
}

const EAR_THRESHOLD = 0.25;

async function processFrame(image) {
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
  let blinkCount = 0;

  for (const detection of detections) {
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const leftEAR = calculateEyeAspectRatio(leftEye);
    const rightEAR = calculateEyeAspectRatio(rightEye);

    const ear = (leftEAR + rightEAR) / 2.0;

    if (ear < EAR_THRESHOLD) {
      blinkCount++;
    }
  }

  return blinkCount;
}

async function processVideo(videoPath) {
  await loadModels();

  return new Promise((resolve, reject) => {
    const blinkCounts = [];

    const command = ffmpeg(videoPath)
      .on('error', (err) => reject(err))
      .on('end', () => {
        const totalBlinks = blinkCounts.reduce((a, b) => a + b, 0);
        resolve(totalBlinks);
      })
      .frames(1)
      .format('image2pipe')
      .pipe();

    command.on('data', async (frame) => {
      try {
        // Convert the frame buffer to an Image
        const image = new Image();
        image.src = frame;
        const blinkCount = await processFrame(image);
        blinkCounts.push(blinkCount);
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = {
  processVideo
};
