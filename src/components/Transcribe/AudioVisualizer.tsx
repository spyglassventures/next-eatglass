"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface AudioVisualizerProps {
    stream: MediaStream | null;
    backgroundColor?: string;
    barColorStart?: string;
    barColorEnd?: string;
    barGap?: number;
    smoothingTimeConstant?: number;
    fftSize?: 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
    stream,
    backgroundColor = "rgb(249, 250, 251)",
    barColorStart = "rgb(59, 130, 246)",
    barColorEnd = "rgb(139, 92, 246)",
    barGap = 2,
    smoothingTimeConstant = 0.8,
    fftSize = 256,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const smoothedDataRef = useRef<Float32Array | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const setupAudio = useCallback((newStream: MediaStream) => {
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
            audioContextRef.current.close().catch(console.error);
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();

        analyser.smoothingTimeConstant = smoothingTimeConstant;
        analyser.fftSize = fftSize;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const newSmoothedData = new Float32Array(bufferLength).fill(0);

        const source = audioContext.createMediaStreamSource(newStream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
        dataArrayRef.current = dataArray;
        smoothedDataRef.current = newSmoothedData;
    }, [fftSize, smoothingTimeConstant]);

    const draw = useCallback(() => {
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas?.getContext("2d");
        const currentSmoothedData = smoothedDataRef.current;

        if (!analyser || !dataArray || !canvas || !canvasCtx || !currentSmoothedData) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            return;
        }

        analyser.getByteFrequencyData(dataArray);

        const width = canvas.width;
        const height = canvas.height;
        const bufferLength = analyser.frequencyBinCount;

        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, width, height);

        const totalBarSpace = width - (bufferLength - 1) * barGap;
        const barWidth = Math.max(1, totalBarSpace / bufferLength);

        let x = 0;
        const gradient = canvasCtx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, barColorStart);
        gradient.addColorStop(1, barColorEnd);

        canvasCtx.strokeStyle = gradient;
        canvasCtx.lineWidth = barWidth;
        canvasCtx.lineCap = "round";

        const newSmoothedData = new Float32Array(bufferLength);

        for (let i = 0; i < bufferLength; i++) {
            const rawValue = dataArray[i];
            const currentSmoothValue = currentSmoothedData[i] || 0;
            const smoothedValue = currentSmoothValue * smoothingTimeConstant + rawValue * (1 - smoothingTimeConstant);
            newSmoothedData[i] = smoothedValue;

            const barHeight = Math.max(1, (smoothedValue / 255) * height);
            const startX = x + barWidth / 2;
            const startY = height;
            const endY = height - barHeight;

            canvasCtx.beginPath();
            canvasCtx.moveTo(startX, startY);
            canvasCtx.lineTo(startX, endY);
            canvasCtx.stroke();

            x += barWidth + barGap;
            if (x > width) break;
        }

        smoothedDataRef.current = newSmoothedData;
        animationFrameRef.current = requestAnimationFrame(draw);
    }, [backgroundColor, barColorStart, barColorEnd, barGap, smoothingTimeConstant]);

    useEffect(() => {
        if (stream && canvasRef.current) {
            setupAudio(stream);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            if (audioContextRef.current && audioContextRef.current.state !== "closed") {
                audioContextRef.current.close().catch(console.error);
                audioContextRef.current = null;
            }
            analyserRef.current = null;
            sourceRef.current = null;
            dataArrayRef.current = null;
            smoothedDataRef.current = null;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            if (audioContextRef.current && audioContextRef.current.state !== "closed") {
                audioContextRef.current.close().catch(console.error);
                audioContextRef.current = null;
            }
        };
    }, [stream, setupAudio, backgroundColor]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !stream || !analyserRef.current) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            return;
        }

        const handleResize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
            }
        };

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(canvas);
        handleResize();

        if (!animationFrameRef.current && analyserRef.current) {
            if (!smoothedDataRef.current || smoothedDataRef.current.length !== analyserRef.current.frequencyBinCount) {
                smoothedDataRef.current = new Float32Array(analyserRef.current.frequencyBinCount).fill(0);
            }
            draw();
        }

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [draw, stream]);

    return (
        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />
        </div>
    );
};

export default AudioVisualizer;
