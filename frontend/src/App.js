// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { useSpeechSynthesis } from "react-speech-kit";
import { drawRect } from "./utilities";

function App() {
  const { speak } = useSpeechSynthesis();
  const [detectedClass, setDetectedClass] = useState("");
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // useEffect(() => {
  //   // speak({ text: detectedClass })
  //   console.log('Class changed!')
  // }, [detectedClass])

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx, setDetectedClass);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <h1 className="text-xl">Class: {detectedClass}</h1>

      <button onClick={() => speak({ text: detectedClass })}>Speak</button>
      <header className="App-header">
        <div class="webcamCapture">
          <Webcam
            ref={webcamRef}
            muted={true}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 8,
            }}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
