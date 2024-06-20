import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { createCanvas, loadImage } from 'canvas';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { promisify } from 'util';

const pipeline = promisify(require('stream').pipeline);

async function extractFrame(videoPath, outputFramePath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .on('end', resolve)
            .on('error', reject)
            .screenshots({
                count: 1,
                folder: '.',
                filename: outputFramePath,
                size: '640x?'
            });
    });
}

export async function checkFingerCount(videoPath) {
    const outputFramePath = 'frame.jpg';
    try {
        console.log("Step 1 ->Extracting frame...");
        await extractFrame(videoPath, outputFramePath);
        console.log("Frame extracted to:", outputFramePath);

        console.log("Loading hand pose detection model...");
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
            runtime: 'tfjs',
            modelType: 'full'
        };
        const detector = await handPoseDetection.createDetector(model, detectorConfig);
        console.log("Model loaded and detector created.");

        console.log("Loading extracted frame image...");
        const img = await loadImage(outputFramePath);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        console.log("Image loaded and drawn to canvas.");

        console.log("Estimating hands...");
        const hands = await detector.estimateHands(canvas);
        console.log("Hands estimated:", hands);

        const fingerTipIndices = [4, 8, 12, 16, 20];
        const fingerCounts = hands.map(hand => {
            return fingerTipIndices.filter(index => {
                const keypoint = hand.keypoints[index];
                return keypoint && keypoint.score > 0.2;
            }).length;
        });

        console.log("Finger counts:", fingerCounts);

        fs.unlinkSync(outputFramePath); // Clean up the frame file

        return { success: true, message: "Finger count calculated", fingerCounts };
    } catch (error) {
        console.error("Error generating finger count:", error);
        if (fs.existsSync(outputFramePath)) {
            fs.unlinkSync(outputFramePath); // Ensure cleanup on error
        }
        return { success: false, message: "Unable to generate finger count", fingerCounts: null };
    }
}
