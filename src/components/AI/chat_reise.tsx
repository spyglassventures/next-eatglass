'use client'

import ChatStructure from './gen_chat_structure' // Importing the main chat structure component
import { useChat } from 'ai/react' // Importing useChat hook to handle chat functionality
import { warning_msg, followupBtn, placeHolderInput, examplesData, rawInitialMessages } from '@/config/ai/ai_tabs/reise_message' // Importing the initial messages for the chat, not plural

// Main component for the Kostengutsprache chat: set showPraeparatSearch to false to disable the PraeparatSearchForm 
export default function ChatReise({ showPraeparatSearch = false }) {
  // useChat hook is used to handle the chat messages, input, and submission
  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, error } = useChat({
    // Transforming the initial messages into the correct format
    initialMessages: rawInitialMessages.map(message => ({
      ...message,
      role: message.role as 'function' | 'system' | 'user' | 'assistant' | 'data' | 'tool', // Ensuring the role is correctly typed
      content: message.content.join('\n') // Joining content into a single string
    })),
  });

  // Rendering the chat structure component with specific props for Medis
  return (
    <ChatStructure
      messages={messages} // Array of chat messages
      input={input} // Current input value
      setInput={setInput} // Function to set the input value
      handleInputChange={handleInputChange} // Function to handle changes in the input field
      handleSubmit={handleSubmit} // Function to handle form submission
      warningMessage={warning_msg} // Custom warning message for this chat
      followupBtn={followupBtn} // Follow-up button texts
      placeHolderInput={placeHolderInput[0]} // Placeholder text for the input field
      examplesData={examplesData} // Examples data for clickable suggestions
      showPraeparatSearch={showPraeparatSearch}  // Boolean to control rendering of the PraeparatSearchForm
    />
  );
}
