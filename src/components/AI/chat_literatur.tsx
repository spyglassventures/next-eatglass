'use client';

import { useState } from 'react';
import ChatStructure from './gen_chat_structure';
import {
  warning_msg,
  followupBtn,
  placeHolderInput,
  examplesData,
  rawInitialMessages,
} from '@/config/ai/ai_tabs/literatur_message';
import ModelSelector from './ModelSelector';

// Define the type for a message
interface Message {
  id: string;
  role: 'function' | 'user' | 'system' | 'assistant' | 'data' | 'tool';
  content: string;
}
export default function ChatLiteratur({ showPraeparatSearch = false }) {

  const [messages, setMessages] = useState<Message[]>(
    rawInitialMessages.map((message) => ({
      ...message,
      role: message.role as Message['role'],
      content: message.content.join('\n'),
    }))
  );
  const [input, setInput] = useState('');
  const [modelPath, setModelPath] = useState('/api/chat-4o-mini'); // Default model

  const handleModelChange = (value: string) => {
    setModelPath(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch(modelPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        console.error('API error:', await response.text());
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      if (reader) {
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            accumulatedResponse += chunk;

            setMessages((prev) => [
              ...prev.filter((m) => m.role !== 'assistant'),
              { id: Date.now().toString(), role: 'assistant', content: accumulatedResponse },
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  return (
    <div>
      {/* Compact Model Selector */}
      <ModelSelector modelPath={modelPath} onModelChange={handleModelChange} />

      <ChatStructure
        messages={messages}
        input={input}
        setInput={setInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        warningMessage={warning_msg}
        followupBtn={followupBtn}
        placeHolderInput={placeHolderInput[0]}
        examplesData={examplesData}
        showPraeparatSearch={showPraeparatSearch}
      />
    </div>
  );
}
