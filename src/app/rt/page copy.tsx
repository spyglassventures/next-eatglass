'use client';

import React, { useEffect, useRef, useState } from "react";
import InteractionStatus from "../../components/Realtime/InteractionStatus";
import VoiceVisualizer from "../../components/Realtime/VoiceVisualizer";
import VoicePicker from "@/components/Realtime/VoicePicker";

const RTPage = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [status, setStatus] = useState("Click to connect to AI...");
    const [interaction, setInteraction] = useState<"user" | "ai" | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioContext = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
    const dataArray = useRef<Uint8Array | null>(null);
    const idleTimeout = useRef<NodeJS.Timeout | null>(null);
    const [selectedVoice, setSelectedVoice] = useState("ash");

    const init = async () => {
        try {
            console.log("Initializing connection...");
            setStatus("Connecting...");
            setInteraction(null);

            const tokenResponse = await fetch("/api/session");
            const data = await tokenResponse.json();
            const EPHEMERAL_KEY = data.client_secret.value;

            const peerConnection = new RTCPeerConnection();
            const audioEl = document.createElement("audio");
            audioEl.autoplay = true;

            // Set up microphone input and audio level tracking
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!audioContext.current) {
                audioContext.current = new AudioContext();
                analyser.current = audioContext.current.createAnalyser();
                microphone.current = audioContext.current.createMediaStreamSource(mediaStream);
                dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);

                microphone.current.connect(analyser.current);
                trackMicrophoneInput();
            }

            peerConnection.addTrack(mediaStream.getTracks()[0]);

            peerConnection.ontrack = (e) => {
                console.log("Audio track received, switching to AI interaction...");
                audioEl.srcObject = e.streams[0];

                audioEl.onplaying = () => {
                    console.log("AI audio is playing.");
                    setIsAudioPlaying(true);
                    setInteraction("ai");
                    setStatus("Doc Dialog hört Ihnen zu und gibt Ihnen eine Antwort. Sie können jederzeit unterbrechen.");
                    clearIdleTimeout();
                };

                audioEl.onended = () => {
                    console.log("AI audio ended.");
                    setIsAudioPlaying(false);
                    setInteraction("user");
                    setStatus("Listening...");
                };

                audioEl.play().catch((err) => console.error("Audio playback error:", err));
            };

            const dataChannel = peerConnection.createDataChannel("oai-events");
            dataChannel.addEventListener("message", (e) => {
                try {
                    const event = JSON.parse(e.data);
                    if (event.response?.text) {
                        console.log("AI response received:", event.response.text);
                        setInteraction("ai");
                        setStatus(`AI: ${event.response.text}`);
                    }
                } catch (error) {
                    console.error("Failed to process message:", error);
                }
            });

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = "gpt-4o-realtime-preview-2024-12-17";
            const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${EPHEMERAL_KEY}`,
                    "Content-Type": "application/sdp",
                },
            });

            const answer: RTCSessionDescriptionInit = {
                type: "answer",
                sdp: await sdpResponse.text(),
            };
            await peerConnection.setRemoteDescription(answer);

            setIsConnected(true);
            setStatus("Connected. Speak to the AI...");
            setInteraction("user");
        } catch (error) {
            console.error("Error initializing connection:", error);
            setStatus("Failed to connect. Please try again.");
        }
    };

    const trackMicrophoneInput = () => {
        if (analyser.current && dataArray.current) {
            const checkAudioLevels = () => {
                // Ensure analyser and dataArray are not null
                if (analyser.current && dataArray.current) {
                    analyser.current.getByteFrequencyData(dataArray.current);

                    const average =
                        dataArray.current.reduce((sum, value) => sum + value, 0) /
                        dataArray.current.length;

                    if (average > 20) {
                        // High microphone input indicates user is speaking
                        setInteraction("user");
                        setStatus("Ich höre...");
                    } else if (!isAudioPlaying) {
                        // Low microphone input and no AI audio playing
                        setInteraction("ai");
                        setStatus("Doc Dialog hört Ihnen zu und gibt Ihnen eine Antwort. Sie können jederzeit unterbrechen.");
                    }
                }

                requestAnimationFrame(checkAudioLevels);
            };

            checkAudioLevels();
        }
    };

    const handleVoiceSelect = (voice: string) => {
        console.log(`Voice selected: ${voice}`);
        setSelectedVoice(voice);
    };



    const clearIdleTimeout = () => {
        if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };

    useEffect(() => {
        return () => {
            audioContext.current?.close();
            clearIdleTimeout();
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Echtzeit KI Interaktion</h1>
            <div className="w-full max-w-lg text-center ">
                {!isConnected ? (
                    <button
                        onClick={init}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Verbindung mit Doc Dialog Voice herstellen
                    </button>
                ) : (
                    <>
                        <InteractionStatus
                            interaction={interaction}
                            status={status}
                            isAudioPlaying={isAudioPlaying}
                        />
                        <div className="w-full mt-4">
                            <VoiceVisualizer />
                        </div>
                        {/* not yet implemented with API */}
                        {/* <div className="w-full mt-4">
                            <VoicePicker onVoiceSelect={handleVoiceSelect} />
                        </div> */}

                    </>
                )}
            </div>
        </div>
    );
};

export default RTPage;
