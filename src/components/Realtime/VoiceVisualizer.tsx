import React, { useState, useEffect } from "react";
import { Visualizer } from "react-sound-visualizer";

const VoiceVisualizer: React.FC = () => {
    const [audio, setAudio] = useState<MediaStream | null>(null);

    // Start capturing audio
    const startAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudio(stream);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    // Stop capturing audio
    const stopAudio = () => {
        if (audio) {
            audio.getTracks().forEach((track) => track.stop());
            setAudio(null);
        }
    };

    useEffect(() => {
        startAudio();
        return () => {
            stopAudio();
        };
    }, []);

    return (
        <div className="w-full flex justify-center items-center h-30  ">
            <Visualizer
                audio={audio}
                mode="continuous"
                // lineWidth="thin"
                strokeColor="#00f"
                autoStart={true}
                slices={100}
            >
                {({ canvasRef }) => (
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={50}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                )}
            </Visualizer>
        </div>
    );
};

export default VoiceVisualizer;
