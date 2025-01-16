'use client';

import { useEffect, useState, useRef } from 'react';
import { useFilter } from '@/components/AI/FilterContext'; // If needed
import ChatStructure from './gen_chat_structure_expandable';
import CancelButton from '././ai_utils/CancelButton'; // Import the CancelButton component
import {
  warning_msg,
  followupBtn,
  inputCloudBtn,
  placeHolderInput,
  examplesData,
  rawInitialMessages,
} from '@/config/ai/ai_tabs/diagnose_message';

import ModelSelector from './ModelSelector';

// Define the type for a message
interface Message {
  id: string;
  role: 'function' | 'user' | 'system' | 'assistant' | 'data' | 'tool';
  content: string;
}

export default function ChatDiagnose({ showPraeparatSearch = false }: { showPraeparatSearch?: boolean }) {
  const { activeFilter } = useFilter(); // If you have this context
  const [modelPath, setModelPath] = useState('/api/chat-4o-mini'); // Default model path
  const [messages, setMessages] = useState<Message[]>(() =>
    rawInitialMessages.map((message) => ({
      ...message,
      role: message.role as Message['role'],
      content: Array.isArray(message.content) ? message.content.join('\n') : message.content,
    }))
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log('Active Filter in Chat Component:', activeFilter);
  }, [activeFilter]);

  const handleModelChange = (value: string) => {
    setModelPath(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(modelPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
        signal: controller.signal, // Attach the AbortController signal
      });

      if (!response.ok) {
        console.error('API error:', await response.text());
        setIsLoading(false);
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

            setMessages((prev) => {
              const filtered = prev.filter((m) => !(m.role === 'assistant' && m.id === 'streaming'));
              return [
                ...filtered,
                {
                  id: 'streaming',
                  role: 'assistant',
                  content: accumulatedResponse,
                },
              ];
            });
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === 'streaming' ? { ...m, id: Date.now().toString() } : m
          )
        );
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('Error submitting message:', err);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the ongoing fetch request
      setIsLoading(false);
    }
  };

  return (
    <div>
      {activeFilter === 'Pro' && (
        <ModelSelector modelPath={modelPath} onModelChange={handleModelChange} />
      )}

      <ChatStructure
        messages={messages}
        input={input}
        setInput={setInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        warningMessage={warning_msg}
        followupBtn={followupBtn}
        inputCloudBtn={inputCloudBtn}
        placeHolderInput={placeHolderInput[0]}
        examplesData={examplesData}
        showPraeparatSearch={showPraeparatSearch}
      />

      <div>
        {isLoading && <CancelButton isLoading={isLoading} onCancel={handleCancel} />}
      </div>

      {/* enable for cancel btn debuggung */}
      {/* <div>
        <CancelButton isLoading={true} onCancel={handleCancel} />
      </div>*/}
    </div>
  );
}
