'use client'

import { useChat } from 'ai/react'
import { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import CopyToClipboard from '@/components/copy-to-clipboard'

// Helper function to format the message content
function formatMessageContent(content) {
  return content.split('**').map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  )
}

export default function Chat_summary() {
  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: [
      {
        id: Date.now().toString(),
        role: 'system',
        content: `Du bist ein KI-Modell, Zusammenfassungen erstellst.
        Erstelle eine kurze Zusammenfassung.
        Dann schlage Detailfragen vor, welche den Nutzer interessieren könnten.
        Formatiere Überschriften mit **doppelten Sternchen**.
        `
      },
    ],
  })

  useEffect(() => {
    if (ref.current === null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
  }, [messages])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleSubmit(e)
  }

  return (
    <section className='py-1 text-zinc-700 dark:text-zinc-300'>
      <div className='container'>

      <div className='mt-3 w-full max-w-full text-left relative -ml-4'>
          <h1 className='font-medium pt-5 text-zinc-900 dark:text-zinc-100'>Closed-Beta Test: Frage des Juristen + Hintergrundinfos ➜ Entwurf zur Antwort.</h1>
        </div>

        {/* Chat area */}
        <div className='mt-3 w-full max-w-full text-left relative -ml-4'>
          <div className='absolute top-0 right-0 -mt-10 ml-2'>
            <CopyToClipboard message={messages[messages.length - 1]} className='' />
          </div>
        
          <div className='absolute top-0 right-0 mt-2 mr-0'>
            
          </div>
          <div
            className='mb-2 h-[500px] rounded-md border dark:border-zinc-700 overflow-auto text-left bg-white dark:bg-zinc-900'
            ref={ref}
          >
            {messages.map(m => (
              <div key={m.id} className='mr-6 whitespace-pre-wrap md:mr-12 text-left'>
                {m.role === 'user' && (
                  <div className='mb-6 flex gap-3 text-left'>
                    <div className='mt-1.5 bg-blue-100 dark:bg-blue-900 p-3 rounded-md'>
                      <p className='font-semibold text-blue-800 dark:text-blue-300'>Ihre Eingabe:</p>
                      <div className='mt-1.5 text-sm text-blue-700 dark:text-blue-200'>
                        {formatMessageContent(m.content)}
                      </div>
                    </div>
                  </div>
                )}

                {m.role === 'assistant' && (
                  <div className='mb-6 flex gap-3 text-left'>
                    <div className='mt-1.5 w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                      <div className='flex justify-between'>
                        <p className='font-semibold text-green-800 dark:text-green-300'>Copilot</p>
                      </div>
                      <div className='mt-2 text-sm text-green-700 dark:text-green-200'>
                        {formatMessageContent(m.content)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className='relative'>
            <Input
              name='message'
              value={input}
              onChange={handleInputChange}
              placeholder='Text hier reinkopieren und Enter drücken.'
              className='pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400'
            />
           <button
              type='submit'
              className='absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center'
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
