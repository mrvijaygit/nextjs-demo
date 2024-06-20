// const { downloadFileFromMinio } = require('./fileUtils'); // Assuming fileUtils.js contains the downloadFileFromMinio function
// const { Code } = require('./codes'); // Assuming codes.js contains the error codes

// async function liveAllTemplate(fileId, bucketName, faceTemplate, expected, metadata) {
//     const finalResult = {};
//     let isFailed = false;

//     const errorMapping = {
//         'blink': Code.BLINK_FAILED,
//         'movement': Code.MOVEMENT_FAILED,
//         'speech': Code.SPEECH_FAILED,
//         'fingercount': Code.FINGER_COUNT_FAILED
//     };

//     if (expected && metadata) {
//         const videoPath = await downloadFileFromMinio(fileId, bucketName);
//         if (!videoPath) {
//             return {
//                 success: false,
//                 message: "File download failed",
//                 code: Code.FILE_DOWNLOAD_FAILED
//             };
//         }

//         for (const key in expected) {
//             if (expected[key].enabled) {
//                 const videoInterval = metadata[key].video;

//                 if (key === "blink" && !isFailed) {
//                     const blinkExpected = expected[key].expected;
//                     const { success, filePath } = await liveVideoInterval(videoPath, videoInterval);
//                     if (success) {
//                         finalResult[key] = await liveBlink(filePath, blinkExpected, faceTemplate);
//                         if (!finalResult[key].success) {
//                             isFailed = true;
//                         }
//                     } else {
//                         return {
//                             success: false,
//                             message: filePath,
//                             results: finalResult,
//                             code: Code.VIDEO_INTERVAL_FAILED
//                         };
//                     }
//                 } else if (key === "movement" && !isFailed) {
//                     console.log("movement", key);
//                     const { success, filePath } = await liveVideoInterval(videoPath, videoInterval);
//                     if (success) {
//                         finalResult[key] = await liveMovement(filePath, faceTemplate);
//                         if (!finalResult[key].success) {
//                             isFailed = true;
//                         }
//                     } else {
//                         return {
//                             success: false,
//                             message: filePath,
//                             results: finalResult,
//                             code: Code.VIDEO_INTERVAL_FAILED
//                         };
//                     }
//                 } else if (key === "speech" && !isFailed) {
//                     const speechExpected = expected[key].expected;
//                     const { success, filePath } = await liveVideoInterval(videoPath, videoInterval);
//                     if (success) {
//                         finalResult[key] = await liveSpeech(filePath, speechExpected, faceTemplate);
//                         if (!finalResult[key].success) {
//                             isFailed = true;
//                         }
//                     } else {
//                         return {
//                             success: false,
//                             message: filePath,
//                             results: finalResult,
//                             code: Code.VIDEO_INTERVAL_FAILED
//                         };
//                     }
//                 } else if (key === "fingercount" && !isFailed) {
//                     const fingerCountExpected = expected[key].expected;
//                     const { success, filePath } = await liveVideoInterval(videoPath, videoInterval);
//                     if (success) {
//                         finalResult[key] = await liveFingerCount(filePath, fingerCountExpected, faceTemplate);
//                         if (!finalResult[key].success) {
//                             isFailed = true;
//                         }
//                     } else {
//                         return {
//                             success: false,
//                             message: filePath,
//                             results: finalResult,
//                             code: Code.VIDEO_INTERVAL_FAILED
//                         };
//                     }
//                 } else {
//                     finalResult[key] = { success: false, message: "Not processed", code: Code.NOT_PROCESSED };
//                 }
//             }
//         }

//         for (const key in finalResult) {
//             if (!finalResult[key].success) {
//                 const errorCode = errorMapping[key] || "";
//                 return {
//                     success: false,
//                     message: finalResult[key].message,
//                     results: finalResult,
//                     code: errorCode
//                 };
//             }
//         }

//         return {
//             success: true,
//             message: "Success",
//             results: finalResult,
//             code: Code.SUCCESS
//         };
//     } else {
//         return {
//             success: false,
//             message: "Expected or metadata field is missing",
//             code: Code.FIELD_MISSING
//         };
//     }
// }

// module.exports = {
//     liveAllTemplate
// };
