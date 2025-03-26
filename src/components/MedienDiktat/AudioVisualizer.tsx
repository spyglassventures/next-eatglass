"use client";

import React, { useRef, useEffect } from "react";

interface AudioVisualizerProps {
    stream: MediaStream;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ stream }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        if (!canvasCtx) return;

        // Set up audio context and analyzer
        const AudioContext = window.AudioContext
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Connect the stream to the analyzer
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        // Function to draw the visualization
        const draw = () => {
            // Set canvas dimensions
            const width = canvas.width;
            const height = canvas.height;

            // Request next animation frame
            animationFrameRef.current = requestAnimationFrame(draw);

            // Get frequency data
            analyser.getByteFrequencyData(dataArray);

            // Clear canvas
            canvasCtx.fillStyle = "rgb(249, 250, 251)";
            canvasCtx.fillRect(0, 0, width, height);

            // Calculate bar width based on canvas size and buffer length
            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;

            // Draw bars for each frequency
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * height;

                // Create gradient from blue to purple
                const gradient = canvasCtx.createLinearGradient(0, height, 0, height - barHeight);
                gradient.addColorStop(0, "rgb(59, 130, 246)"); // Blue
                gradient.addColorStop(1, "rgb(139, 92, 246)"); // Purple

                canvasCtx.fillStyle = gradient;
                canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
                if (x > width) break;
            }
        };

        // Start visualization
        draw();

        // Cleanup function
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContext.state !== "closed") {
                audioContext.close();
            }
        };
    }, [stream]);

    return (
        <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
            <canvas
                ref={canvasRef}
                width={300}
                height={80}
                className="w-full"
            />
        </div>
    );
};

export default AudioVisualizer;