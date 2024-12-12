'use client'

import { useEffect, useState } from 'react'
import { type Message } from 'ai'
import { useClipboard } from '@/hooks/use-clipboard'
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'
import { LuMoveDownLeft } from 'react-icons/lu'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

const allowedLanguages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'Englisch', flag: '🇬🇧' },
  { code: 'fr', name: 'Französisch', flag: '🇫🇷' },
  { code: 'it', name: 'Italienisch', flag: '🇮🇹' },
  { code: 'es', name: 'Spanisch', flag: '🇪🇸' },
  { code: 'pt', name: 'Portugiesisch', flag: '🇵🇹' },
  { code: 'tr', name: 'Türkisch', flag: '🇹🇷' },
  { code: 'sr', name: 'Serbisch', flag: '🇷🇸' },
  { code: 'hr', name: 'Kroatisch', flag: '🇭🇷' },
  { code: 'zh', name: 'Chinesisch', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', name: 'Russisch', flag: '🇷🇺' },
  { code: 'uk', name: 'Ukrainisch', flag: '🇺🇦' },
  { code: 'ja', name: 'Japanisch', flag: '🇯🇵' },
  { code: 'ko', name: 'Koreanisch', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabisch', flag: '🇸🇦' },
  { code: 'nl', name: 'Niederländisch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polnisch', flag: '🇵🇱' },
  { code: 'sv', name: 'Schwedisch', flag: '🇸🇪' },
  { code: 'fi', name: 'Finnisch', flag: '🇫🇮' },
  { code: 'da', name: 'Dänisch', flag: '🇩🇰' },
  { code: 'he', name: 'Hebräisch', flag: '🇮🇱' }
]

export default function CopyToClipboard({
  message,
  className = '',
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useClipboard({ timeout: 2000 })
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      const filteredVoices = new Map<string, SpeechSynthesisVoice>()

      availableVoices.forEach(voice => {
        const langCode = voice.lang.split('-')[0]
        if (allowedLanguages.some(lang => lang.code === langCode) && !filteredVoices.has(langCode)) {
          filteredVoices.set(langCode, voice)
        }
      })

      const uniqueVoices = Array.from(filteredVoices.values())

      uniqueVoices.sort((a, b) => {
        const aLang = a.lang.split('-')[0]
        const bLang = b.lang.split('-')[0]
        const aIndex = allowedLanguages.findIndex(lang => lang.code === aLang)
        const bIndex = allowedLanguages.findIndex(lang => lang.code === bLang)
        return aIndex - bIndex
      })

      setVoices(uniqueVoices)

      // Set German as default if available
      const defaultVoice = uniqueVoices.find(voice => voice.lang.startsWith('de'))
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name)
      }
    }

    updateVoices()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices
    }
  }, [allowedLanguages]) // Explicitly include allowedLanguages in the dependency array

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  const onSpeak = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(message.content)
      const voice = voices.find(v => v.name === selectedVoice)
      if (voice) utterance.voice = voice
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const getDisplayName = (voice: SpeechSynthesisVoice) => {
    const langCode = voice.lang.split('-')[0]
    const language = allowedLanguages.find(lang => lang.code === langCode)
    return language ? `${language.flag} ${language.name}` : voice.lang
  }

  return (
    <div className={`flex items-center space-x-2  ${className}`} {...props}>

      <div className='flex items-center rounded-lg border border-dashed border-grey p-1 transition ease-in-out delay-150 hover:-translate-y-1 duration-300 '>
        <button
          className='flex items-center justify-center p-2 rounded '
          onClick={onSpeak}
          aria-label={isSpeaking ? "Stop reading aloud" : "Read message aloud"}
        >
          {isSpeaking ? (
            <SpeakerXMarkIcon className='h-5 w-5 text-blue-500 hover:text-blue-700' />
          ) : (
            <SpeakerWaveIcon className='h-5 w-5 text-blue-500 hover:text-blue-700' />
          )}
        </button>
        <select
          className="p-2 border rounded text-sm bg-white ml-2"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          aria-label="Select voice language"
        >
          <option disabled value="">
            Vorlesen in ...
          </option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {getDisplayName(voice)}
            </option>
          ))}
        </select>
      </div>
      <div className='flex items-center rounded-lg border border-dashed border-grey p-1 hover:-translate-y-1'>
        <button
          className='flex items-center justify-center p-2 rounded transition duration-200'
          onClick={onCopy}
          aria-label="Copy message"
        >
          {isCopied ? (
            <ClipboardDocumentCheckIcon className='h-5 w-5 text-emerald-500 hover:text-emerald-700' />
          ) : (
            <ClipboardDocumentIcon className='h-5 w-5 text-gray-500 hover:text-gray-700' />
          )}
        </button>
      </div>
    </div>
  )
}
