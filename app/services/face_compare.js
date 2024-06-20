const fs = require('fs');
const path = require('path');
const { Canvas, Image, ImageData } = canvas;
const { encode } = require('base64-arraybuffer');
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';

// Configure face-api.js to use the canvas implementation from node-canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


async function loadModels() {
    // const modelPath = path.join(__dirname, 'models');
    const modelPath = "/Users/grootan/Goals/demo-app/public/models"
    console.log("model path -> ", modelPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
}

async function generateFaceTemplate(imagePath) {
    try {
        await loadModels();
        const img = await canvas.loadImage(imagePath);
        console.log("Image loaded successfully");
        const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
        console.log("Detections:", detections);

        if (detections.length === 0) {
            return { success: false, message: "No Face Detected", template: null };
        } else if (detections.length !== 1) {
            return { success: false, message: "Multiple Faces Detected", template: null };
        } else {
            const embeddingVector = detections[0].descriptor;
            const buffer = new Uint8Array(new Float32Array(embeddingVector).buffer);
            const base64String = encode(buffer);
            return { success: true, message: "Face Template generated successfully", template: base64String };
        }
    } catch (error) {
        console.error("Error generating face template:", error);
        return { success: false, message: "Unable to generate Face Template", template: null };
    }
}

module.exports = {
    generateFaceTemplate
};