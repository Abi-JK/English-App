import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeech = () => {
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };
      rec.onend = () => setIsRecording(false);
      setRecognition(rec);
    }
  }, []);

  const speak = useCallback((text, rate = 0.92) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const startRecording = useCallback(() => {
    setTranscript('');
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    } else {
      setIsRecording(true);
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
    } else {
      setIsRecording(false);
    }
  }, [recognition]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const verifySpeech = useCallback((expectedText, spokenTranscript) => {
    const cleanText = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
    const expected = cleanText(expectedText);
    const spoken = cleanText(spokenTranscript);

    let matchCount = 0;
    const analysis = expectedText.split(/\s+/).map(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matched = spoken.includes(cleanWord);
      if (matched) matchCount++;
      return { word, matched };
    });

    const score = Math.round((matchCount / expected.length) * 100);
    return { analysis, score };
  }, []);

  return {
    speak,
    isRecording,
    transcript,
    setTranscript,
    startRecording,
    stopRecording,
    toggleRecording,
    verifySpeech,
    hasRecognition: !!recognition
  };
};
