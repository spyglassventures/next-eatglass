'use client'
import { useChat } from 'ai/react'
import { useEffect, useRef, useState, useCallback } from 'react'
import CopyToClipboard from '@/components/copy-to-clipboard'
import FeedbackModal from './FeedbackModal'
import { FaLightbulb } from 'react-icons/fa'
import './styles.css'; // Import the styles


// ****** need to modify for every AI case  *******
import examplesData from '../../config/ai/sidebar_examples/freitext_sidebar_config.json';
import rawInitialMessages from '../../config/ai/ai_context/freitext_message.json'
// Define header message (what can user expect)
const warning_msg = 'Closed-Beta Test: Sie können eingeben, was Sie möchten';
// Define the buttons for follow up suggestions (context specific)
const followupBtn = ['mehr Argumente', 'eloquenter formulieren', 'übersetze in Ukrainisch'];
// *********************************************


// Helper function to format the message content
const FormatMessageContent = ({ content }) => {
  return content.split('**').map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );
};

// Styling of chat between user and copilot
const Message = ({ message }) => (
  <div key={message.id} className='mr-6 whitespace-pre-wrap md:mr-12 p-2 '>
    {message.role === 'user' && (
      <div className='flex gap-3 relative right-0 justify-end'>
        <div className='bg-blue-100 dark:bg-blue-900 p-3 rounded-md '>
          <p className='font-semibold text-blue-800 dark:text-blue-300'>Ihre Eingabe:</p>
          <div className='mt-1.5 text-sm text-blue-700 dark:text-blue-200'>
            <FormatMessageContent content={message.content} />
          </div>
        </div>
      </div>
    )}
    {message.role === 'assistant' && (
      <div className='flex gap-3'>
        <div className='w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
          <div className='flex justify-between'>
            <p className='font-semibold text-green-800 dark:text-green-300'>Copilot</p>
          </div>
          <div className='mt-2 text-sm text-green-700 dark:text-green-200'>
            <FormatMessageContent content={message.content} />
          </div>
        </div>
      </div>
    )}
  </div>
);

// FollowUpButtons Component
const FollowUpButtons = ({ setInput, handlePopEffect }) => (
  <div className='flex justify-start mt-3 space-x-3'>
    <button
      className='bg-gray-200 text-black px-4 py-2 rounded cursor-pointer flex items-center space-x-2'
      onClick={() => {
        setInput(followupBtn[0])
        handlePopEffect();
      }}
    >
      <FaLightbulb className='text-yellow-500' />
      <span>{followupBtn[0]}</span>
    </button>
    <button
      className='bg-gray-200 text-black px-4 py-2 rounded flex items-center space-x-2'
      onClick={() => {
        setInput(followupBtn[1])
        handlePopEffect();
      }}
    >
      <FaLightbulb className='text-yellow-500' />
      <span>{followupBtn[1]}</span>
    </button>
    <button
      className='bg-gray-200 text-black px-4 py-2 rounded flex items-center space-x-2'
      onClick={() => {
        setInput(followupBtn[2])
        handlePopEffect();
      }}
    >
      <FaLightbulb className='text-yellow-500' />
      <span>{followupBtn[2]}</span>
    </button>
  </div>
);

// Chat Component
export default function Chat_kostengutsprache() {
  const ref = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [showFollowUpButtons, setShowFollowUpButtons] = useState(false);
  const [isPopped, setIsPopped] = useState(false);

  // Define the allowed role types
  type AllowedRoles = 'function' | 'system' | 'user' | 'assistant' | 'data' | 'tool';

  // Transform the content array into a single string and ensure roles are valid
  const initialMessages = rawInitialMessages.map(message => ({
    ...message,
    role: message.role as AllowedRoles,
    content: message.content.join('\n')
  }));

  // Destructure properties from useChat
  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: initialMessages,
  });

  // Scroll to the bottom of the messages when a new message is added
  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  // Show follow-up buttons and other elements when the assistant sends a message
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].role === 'assistant') {
      setHasAnswer(true);
      const timer = setTimeout(() => {
        setShowFollowUpButtons(true);
        const hideTimer = setTimeout(() => {
          setShowFollowUpButtons(false);
        }, 12000);
        return () => clearTimeout(hideTimer);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  // Handle example list item click, scoll to buttom
  const handleLiClick = useCallback((text) => {
    setInput(text);
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const offset = 280;

    window.scrollTo({
      top: currentScroll + offset,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setIsPopped(true);
      setTimeout(() => setIsPopped(false), 300);
    }, 800);
  }, []);

  // pop effect for follow up question buttons
  const handlePopEffect = useCallback(() => {
    setTimeout(() => {
      setIsPopped(true);
      setTimeout(() => setIsPopped(false), 300);
    }, 400);
  }, []);

  return (
    <section className='py-1 text-zinc-700 dark:text-zinc-300'>
      <div className='p-0'>
        <div className='flex flex-wrap items-center mb-3'>
          <div className='w-full md:w-2/3'>
            <h1 className='font-medium text-zinc-900 dark:text-zinc-100 mb-2'></h1>
            <p className='text-m text-zinc-600 dark:text-zinc-400'>
              {warning_msg}
            </p>
          </div>
          <div className='w-full md:w-1/3 pl-3'>
            {hasAnswer && (
              <div className='flex justify-left items-center p-0 '>
                <CopyToClipboard message={messages[messages.length - 1]} />
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-wrap mb-3 '>
          <div className='w-full md:w-2/3 mb-3 md:mb-0'>
            <div
              className='h-[500px] rounded-md border dark:border-zinc-700 overflow-auto bg-white dark:bg-zinc-900 p-4 '
              ref={ref}
            >
              {messages.map((m) => <Message key={m.id} message={m} />)}
            </div>
            {showFollowUpButtons && (
              <FollowUpButtons setInput={setInput} handlePopEffect={handlePopEffect} />
            )}
          </div>

          <div className="w-full md:w-1/3 pl-3 hidden md:block">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md max-h-[500px] overflow-y-auto p-4">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Beispiele für Eingaben (klickbar):</p>
              <ul className="text-sm text-zinc-700 dark:text-zinc-300">
                {examplesData.examples.map((example, index) => (
                  <li key={index} onClick={() => handleLiClick(example)} className="cursor-pointer">{example}</li>
                ))}
              </ul>
              <br></br>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Bekannte Abkürzungen:</p>
              <ul className="text-sm text-zinc-700 dark:text-zinc-300">
                {examplesData.abkuerzungen.map((example, index) => (
                  <li key={index} onClick={() => handleLiClick(example)} className="cursor-pointer">{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center mt-2 pb-0'>
          <div className='w-full md:w-2/3'>
            <form onSubmit={onSubmit} className='relative'>
              <textarea
                name='message'
                value={input}
                onChange={handleInputChange}
                placeholder='Ihre Frage hier eingeben ...'
                className='w-full p-2 placeholder:italic border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md resize-none'
                rows={1}
              />
              <button
                type="submit"
                className={`absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center button-pop ${isPopped ? 'popped' : ''}`}
              >
                Enter
              </button>
            </form>
          </div>
          <div className='w-full md:w-1/3 flex items-start pl-2 pb-2 justify-center md:justify-start md:flex'>
            <button
              className='h-9 w-full bg-gray-600 text-white flex items-center justify-center px-4 rounded-md resize-none border'
              onClick={() => setShowSuggestionsModal(true)}
            >
              Was können wir besser machen?
            </button>
          </div>
        </div>
      </div>
      <FeedbackModal showModal={showSuggestionsModal} setShowModal={setShowSuggestionsModal} />
    </section>
  )
}
