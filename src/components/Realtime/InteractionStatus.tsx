import React from "react";

type InteractionStatusProps = {
    interaction: "user" | "ai" | null;
    status: string;
    isAudioPlaying: boolean; // New prop to track if audio is playing
};

const InteractionStatus: React.FC<InteractionStatusProps> = ({
    interaction,
    status,
    isAudioPlaying,
}) => {
    const currentStatus =
        interaction === "user"
            ? "Ich höre zu..."
            : interaction === "ai" && isAudioPlaying
                ? "Doc Dialog hört Ihnen zu und gibt Ihnen eine Antwort. Sie können jederzeit unterbrechen."
                : status;

    return (
        <div
            className="p-4 border border-gray-300 rounded bg-gray-50 h-34 flex items-center justify-center relative"
        >
            {interaction === "user" && (
                <div className="flex flex-col items-center">
                    <div className="text-lg font-medium">{currentStatus}</div>
                    <div className="w-8 h-8 rounded-full bg-green-500"></div>
                </div>
            )}
            {interaction === "ai" && isAudioPlaying && (
                <div className="flex flex-col items-center">
                    <div className="text-lg font-medium">{currentStatus}</div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
            )}
            {interaction === null && (
                <p className="text-lg font-medium">{currentStatus}</p>
            )}
        </div>
    );
};

export default InteractionStatus;
