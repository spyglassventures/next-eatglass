"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ContactForm() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    if (statusMessage.type === 'success') {
      const timer = setTimeout(() => {
        window.location.href = '/'; // Redirects to homepage
      }, 3000); // Redirects after 3 seconds

      return () => clearTimeout(timer); // Clean up the timeout on component unmount
    }
  }, [statusMessage.type]);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form submission started"); // Confirm function entry
    setLoading(true);

    const data = {
      name: String(event.target.name.value),
      email: String(event.target.email.value),
      message: String(event.target.message.value),
    };

    console.log("Data prepared for sending:", data); // Confirm data preparation

    try {
      console.log("Attempting to send data..."); // Confirm fetch attempt
      const response = await fetch("/api/sendgrid_contact", {
        // file with config, in configuration. Its in path src/pages/api/
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response)

      console.log("Fetch completed, processing response..."); // Confirm fetch completion
      if (response.ok) {
        console.log("Message sent successfully"); // Assuming success on 200
        setStatusMessage({ type: 'success', message: 'Ihre Nachricht wurde erfolgreich versendet.' });
        event.target.reset();
      } else {
        const errorResponse = await response.json();
        console.error("Fetch response was not OK:", errorResponse);
        throw new Error(errorResponse.message || 'Network response was not OK');
      }
    } catch (error) {
      console.error("Error during fetch or processing:", error);
      setStatusMessage({ type: 'error', message: error.message || 'Ihre Nachricht konnte nicht versendet werden. Bitte versuchen Sie es erneut.' });
    }
    setLoading(false);
    console.log("Form processing completed"); // Confirm end of processing
  }


  return (
    <div className="container">
      {statusMessage.message && (
        <div className={`mb-4 text-center py-3 rounded-sm ${statusMessage.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {statusMessage.message}
        </div>
      )}

      <div className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
        <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
          Schreiben Sie uns
        </h2>
        <p className="mb-12 text-base font-medium text-body-color">
          Wir werden uns zeitnahe bei Ihnen melden.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2">
              <div className="mb-8">
                <label htmlFor="name" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Vor- und Nachname
                </label>
                <input type="text" required minLength={5} maxLength={100} placeholder="Dr. med. Hans Meier" className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none" id="name" />
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2">
              <div className="mb-8">
                <label htmlFor="email" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Email-Adresse
                </label>
                <input type="email" required minLength={5} maxLength={100} placeholder="hans.meier@gmail.com" className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none" id="email" />
              </div>
            </div>
            <div className="w-full px-4">
              <div className="mb-8">
                <label htmlFor="message" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Ihre Nachricht
                </label>
                <textarea name="message" rows={5} required minLength={10} maxLength={1500} placeholder="Liebes Team, ..." className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none" id="message"></textarea>
              </div>
            </div>
            <div className="w-full px-4">
              <button type="submit" disabled={loading} className="rounded-sm bg-primary px-9 py-4 text-base disabled:bg-grey-400 disabled:text-gray-100 font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
                Anfrage senden
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
