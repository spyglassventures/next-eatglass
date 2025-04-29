import React from "react";

interface MessageProps {
    prompt: string;
    answer: string;
}

const Message: React.FC<MessageProps> = ({ prompt, answer }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md">
            <div className="text-gray-800 font-semibold">You:</div>
            <div className="mb-2">{prompt}</div>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold">Gemini:</div>
                {answer}
            </div>
        </div>
    );
};

export default Message;