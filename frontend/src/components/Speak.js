import React, { useEffect, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

const Speak = (props) => {
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if (props.mode === "on") {
      console.log("Child is rerendered");
      speak({ text: `This is a ${props.object}` });
    }
  }, [props.mode]);

  return <div></div>;
};

export default Speak;
