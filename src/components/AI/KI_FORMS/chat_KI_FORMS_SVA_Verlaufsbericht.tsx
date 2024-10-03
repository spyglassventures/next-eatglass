import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';
import ChatStructure from '../KI_FORMS/kiForms_chat_structure';
import GenDocxStructure from './gen_docx_structure';

// this is relevant
// 

import { warning_msg, followupBtn, placeHolderInput, examplesData } from '@/config/ai/ai_tabs/KI_FORMS_SVA_Verlaufsbericht_message';
import messageData from '@/config/ai/ai_context/KI_FORMS_SVA_Verlaufsbericht_message.json';
import formStructureData from '@/config/ai/ai_forms/sva_verlaufsbericht_form_structure.json';

interface FormField {
  id: string;
  label: string;
  placeholder: string;
}

export default function ChatCalculator({ showPraeparatSearch = false }) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [docConfig, setDocConfig] = useState({ docTemplatePath: '', saveFileName: '' });
  const [showForm, setShowForm] = useState(false);
  const [showTransferButton, setShowTransferButton] = useState(false);
  const [showPopulateButton, setShowPopulateButton] = useState(false);

  // Load configuration once when the component mounts
  useEffect(() => {
    const fields: FormField[] = formStructureData.fields;
    const initialFormData = fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {} as { [key: string]: string });
    setFormFields(fields);
    setFormData(initialFormData);

    setDocConfig(formStructureData);
  }, []);

  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    initialMessages: messageData.map((message) => ({
      ...message,
      content: Array.isArray(message.content) ? message.content.join('\n') : message.content,
      role: message.role as 'function' | 'system' | 'user' | 'assistant' | 'data' | 'tool', // Explicitly cast the role
    })),
  });

  // Show the "Populate Form" button only when there is a message and its length is greater than 50 characters
  useEffect(() => {
    if (messages.length > 1) {
      setShowPopulateButton(true);
    } else {
      setShowPopulateButton(false);
    }
  }, [messages]);

  // Extract content for sections based on the message
  const extractContentForSections = (content: string) => {
    const sectionPattern = /([A-Z]_\d+)\s.*?\n([\s\S]*?)(?=([A-Z]_\d+|\n\n|$))/g;
    const extractedData = { ...formData };
    const matches = Array.from(content.matchAll(sectionPattern));
    for (const match of matches) {
      const [, section, text] = match;
      if (section in extractedData) {
        extractedData[section] = text.trim();
      }
    }
    return extractedData;
  };

  // Button click handler to populate the form and show "Übertragen in Word"
  const handlePopulateForm = () => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1].content;
      const updatedFormData = extractContentForSections(latestMessage);
      setFormData(updatedFormData);
      setShowForm(true);
      setShowTransferButton(true);
    }
  };

  // Handler for "Übertragen in Word" button
  const handleTransferToWord = () => {
    console.log('Transfer to Word initiated.');
    // Add your logic here to transfer the form data to a Word document
  };

  return (
    <div>
      <ChatStructure
        messages={messages}
        input={input}
        setInput={setInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        warningMessage={warning_msg}

        placeHolderInput={placeHolderInput[0]}


      />

      {/* Show "Formularinhalt übernehmen" button only when a valid message is shown */}
      {showPopulateButton && (
        <button
          onClick={handlePopulateForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Formular anzeigen und aktualisieren
        </button>
      )}

      {showForm && (
        <>
          <GenDocxStructure
            formData={formData}
            formFields={formFields}
            docConfig={docConfig}
          />
          {showTransferButton}
        </>
      )}
    </div>
  );
}
