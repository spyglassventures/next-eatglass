"use client";
import React, { useRef, useState } from 'react';

const AudioRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

 

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        setIsRecording(false);
        chunks.current = [];
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center h-screen w-full justify-center">
  <div className="space-y-4 items-center justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    {recordedUrl && (
      <audio controls src={recordedUrl} className="items-center justify-center" />
    )}
    {!isRecording && !recordedUrl && (
      <button
        onClick={startRecording}
        className="flex items-center justify-center bg-green-500 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none"
      >
        {/* Microphone Icon */}
        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white">
          <path fill="currentColor" d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z" />
        </svg>
      </button>
      
    )
    }
    
    {isRecording && (
      <button
        aria-label="Stop recording"
        onClick={stopRecording}
        className="flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none pulse-ring"
      >
        {/* Stop Icon */}
        <svg className="h-12 w-12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </button>
    )}


  </div>
  {!isRecording && !recordedUrl && (
      <div className="flex items-center justify-center"> 
      <p className="text-black dark:text-white">Das Mikrofon anklicken um die Aufnahme zu starten</p>
      </div>
    
    )
    }
        {recordedUrl && (
  <a
    href={recordedUrl}
    download="recorded_audio.webm"
    className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full w-40 h-20 focus:outline-none"
    style={{
      fontSize: '1rem',
      color: 'white',
      textAlign: 'center',
      lineHeight: '25px',
      padding: '0.3rem'
    }}
  >
    <svg
      width="34"
      height="34"
      viewBox="5 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-1"
      style={{ transform: 'rotate(180deg)' }} // Rotating the SVG to flip the arrow
    >
     
    <path d="M251.66,391.26c-3.446-2.297-8.103-1.366-10.4,2.08l-6.26,9.39v-214.46c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5
		v214.46l-6.26-9.39c-2.297-3.447-6.954-4.377-10.4-2.08c-3.446,2.298-4.378,6.954-2.08,10.401l20,30
		c0.001,0.002,0.003,0.004,0.004,0.006c0.159,0.238,0.333,0.464,0.518,0.682c0.052,0.061,0.106,0.117,0.16,0.176
		c0.136,0.151,0.278,0.296,0.426,0.436c0.068,0.064,0.136,0.126,0.207,0.188c0.156,0.137,0.319,0.266,0.487,0.389
		c0.057,0.042,0.112,0.087,0.171,0.128c0.233,0.162,0.475,0.312,0.726,0.447c0.007,0.004,0.014,0.006,0.02,0.01
		c0.241,0.128,0.49,0.241,0.746,0.343c0.065,0.026,0.131,0.048,0.197,0.072c0.201,0.074,0.406,0.14,0.616,0.196
		c0.079,0.022,0.159,0.042,0.239,0.061c0.206,0.049,0.416,0.087,0.628,0.118c0.077,0.011,0.152,0.026,0.23,0.035
		c0.285,0.033,0.573,0.054,0.866,0.054s0.582-0.021,0.866-0.054c0.077-0.009,0.153-0.024,0.23-0.035
		c0.212-0.031,0.422-0.07,0.628-0.118c0.08-0.019,0.16-0.04,0.239-0.061c0.209-0.057,0.414-0.122,0.616-0.196
		c0.065-0.024,0.131-0.046,0.196-0.072c0.256-0.102,0.505-0.214,0.746-0.343c0.007-0.004,0.014-0.006,0.02-0.01
		c0.251-0.135,0.493-0.286,0.726-0.447c0.059-0.041,0.114-0.086,0.171-0.128c0.168-0.123,0.33-0.252,0.487-0.389
		c0.07-0.061,0.139-0.124,0.207-0.188c0.148-0.139,0.289-0.285,0.426-0.436c0.053-0.059,0.108-0.115,0.16-0.176
		c0.185-0.218,0.359-0.444,0.518-0.682c0.001-0.002,0.003-0.004,0.004-0.006l20-30C256.038,398.214,255.106,393.557,251.66,391.26z"/>
	
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
    Download Audio File
  </a>
)}
{isRecording && (
     <div className="flex items-center justify-center"> 
     <p className="text-black dark:text-white font-bold ">Aufnahme gestartet...</p>
     <br></br>
     </div>
    )}

{isRecording && (
     <div className="flex items-center justify-center"> 
     <p className="text-black dark:text-white">Sprechen Sie jetzt. Erneut drücken, um die Aufnahme zu beenden</p>
     <br></br>
     </div>
    )}

  </div>


  );
};

export default AudioRecorder;


