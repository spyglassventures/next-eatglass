'use client';

import { useEffect, useState } from 'react';
import { useFilter } from '@/components/AI/FilterContext'; // If needed
import ChatStructure from './gen_chat_structure';
import {
  warning_msg,
  followupBtn,
  inputCloudBtn,
  placeHolderInput,
  examplesData,
  rawInitialMessages,
} from '@/config/ai/ai_tabs/grippe_message';

import ModelSelector from './ModelSelector';

// Define the type for a message
interface Message {
  id: string;
  role: 'function' | 'user' | 'system' | 'assistant' | 'data' | 'tool';
  content: string;
}

export default function ChatLabor({ showPraeparatSearch = false }: { showPraeparatSearch?: boolean }) {
  const { activeFilter } = useFilter(); // If you have this context
  const [modelPath, setModelPath] = useState('/api/az-schweiz-chat-4o-mini'); // Default model path for Swiss hosted model
  const [messages, setMessages] = useState<Message[]>(() =>
    rawInitialMessages.map((message) => ({
      ...message,
      role: message.role as Message['role'],
      content: Array.isArray(message.content) ? message.content.join('\n') : message.content,
    }))
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Active Filter in Chat Component:', activeFilter);
  }, [activeFilter]);

  const handleModelChange = (value: string) => {
    setModelPath(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add the user's message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setIsLoading(true);
    try {
      const response = await fetch(modelPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
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

            // Update or append the assistant message as it streams in
            setMessages((prev) => {
              // Remove any partial assistant message being constructed for streaming
              const filtered = prev.filter((m) => !(m.role === 'assistant' && m.id === 'streaming'));
              return [
                ...filtered,
                {
                  id: 'streaming',
                  role: 'assistant',
                  content: accumulatedResponse
                },
              ];
            });
          }
        }

        // Once done, replace the streaming message id with a proper unique id
        setMessages((prev) =>
          prev.map((m) =>
            m.id === 'streaming'
              ? { ...m, id: Date.now().toString() }
              : m
          )
        );
      }
    } catch (err) {
      console.error('Error submitting message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {activeFilter === 'Pro' && (
        <ModelSelector modelPath={modelPath} onModelChange={handleModelChange} />
      )}

      <ChatStructure
        messages={messages} // Pass all messages (system, user, assistant, etc.)
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
    </div>
  );
}
