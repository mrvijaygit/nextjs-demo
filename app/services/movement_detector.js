import { NextApiRequest, NextApiResponse } from 'next';
import ffmpeg from 'fluent-ffmpeg';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

export async function movementDetected(videoPath) {
    console.log("Movement detected called");

    try {
        const frames = await extractFrames(videoPath);
        const movementDetected = await detectMovement(frames);

        // Clean up extracted frames
        frames.forEach(frame => fs.unlinkSync(frame));

        return movementDetected;
    } catch (error) {
        console.error('Error processing video:', error);
        return false;
    }
}

function extractFrames(videoPath) {
    return new Promise((resolve, reject) => {
        const frames = [];
        ffmpeg(videoPath)
            .on('error', (err) => {
                console.error('Error processing video:', err);
                reject(err);
            })
            .on('filenames', (filenames) => {
                filenames.forEach(filename => {
                    frames.push(path.resolve(filename));
                });
            })
            .on('end', () => {
                resolve(frames);
            })
            .outputOptions('-vf', 'fps=1') // Extract 1 frame per second
            .output('frame_%04d.png')
            .run();
    });
}

async function detectMovement(frames) {
    let prevImageData = null;
    let movementDetected = false;

    for (let frame of frames) {
        const image = await loadImage(frame);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (prevImageData) {
            let diff = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                diff += Math.abs(imageData.data[i] - prevImageData.data[i]);
                diff += Math.abs(imageData.data[i + 1] - prevImageData.data[i + 1]);
                diff += Math.abs(imageData.data[i + 2] - prevImageData.data[i + 2]);
            }
            if (diff > 0) {
                movementDetected = true;
                break;
            }
        }
        prevImageData = imageData;
    }

    console.log("movement detected", movementDetected);

    return movementDetected;
}
