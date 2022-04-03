import React, { useEffect, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

const Speak = (props) => {
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if (props.mode === 1) {
      // console.log("Child is rerendered");
      speak({ text: `There is a ${props.object}` });
    }
  }, [props.mode]);

  return <div></div>;
};

export default Speak;
