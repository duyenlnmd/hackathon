// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import Speak from "./components/Speak";
import { useSpeechSynthesis } from "react-speech-kit";
import { drawRect } from "./utilities";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, onValue, child, get } from "firebase/database";

const videoConstraints = {
  facingMode: "environment"
};

function App() {
  const { speak } = useSpeechSynthesis();
  const [status, setStatus] = useState(0)
  const [detectedClass, setDetectedClass] = useState('')
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const buttonClickedHandler = function() {
    speak({ text: `There is a ${detectedClass}` })
  }

  const initializeFirebaseListener = () => {
    const app = initializeApp({
      apiKey: "AIzaSyDse67anXkkzVoGuCXKT1f6rNxKHb-x9s0",
      authDomain: "phoenix-ec8d2.firebaseapp.com",
      databaseURL:
        "https://phoenix-ec8d2-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "phoenix-ec8d2",
      storageBucket: "phoenix-ec8d2.appspot.com",
      messagingSenderId: "553854497928",
      appId: "1:553854497928:web:ba67e6f5e6470e0a25db3d",
      measurementId: "G-YYW7BZBW7H",
    });
    const database = getDatabase(app);

    const valueRef = ref(database, "value");
    onValue(valueRef, (snapshot) => {
      const data = snapshot.val();
      setStatus(data)
      console.log(data)
    });
  }

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Model loaded.");

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
      // initializeFirebaseListener();
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

  const changeHandler = (e) => {
    if (e.detail === 1) {
      setStatus(1)
    } else if (e.detail === 2 || e.detail === 3){
      setStatus(2)
    }
  }

  useEffect(()=>{
    runCoco()
    setTimeout(initializeFirebaseListener(), 1000);
  },[]);

  return (
    <div className="App">
      <h1>Class: {detectedClass}</h1>
      <Speak mode={status} object={detectedClass} />
      <header className="App-header">
        <div className="webcamCapture">
          <Webcam
            ref={webcamRef}
            muted={true}
            videoConstraints={videoConstraints}
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
      <button onClick={buttonClickedHandler}>
        Speak
      </button>
      {/* <button onClick={changeHandler}>
        Change
      </button> */}
    </div>
  );
}

export default App;
