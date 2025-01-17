"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ContactForm() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    if (statusMessage.type === "success") {
      const timer = setTimeout(() => {
        window.location.href = "/"; // Redirects to homepage
      }, 3000); // Redirects after 3 seconds

      return () => clearTimeout(timer); // Clean up the timeout on component unmount
    }
  }, [statusMessage.type]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const data = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      phone: event.target.phone.value,
      email: event.target.email.value,
      specialty: event.target.specialty.value,
    };

    try {
      const response = await fetch("/api/sendgrid_demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatusMessage({ type: "success", message: "Nachricht erfolgreich gesendet!" });
        event.target.reset();
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Fehler beim Senden der Nachricht.");
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      {statusMessage.message && (
        <div
          className={`mb-4 text-center py-3 rounded-sm ${statusMessage.type === "success"
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800"
            }`}
        >
          {statusMessage.message}
        </div>
      )}

      <div className="p-8  bg-gray-700 rounded-md shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-4">
          Sind Sie Grundversorger oder niedergelassender Spezialist?
        </h2>
        <p className="text-lg mb-8">
          Entdecken Sie alle unsere Funktionen in einer gratis Demo mit unseren Expert:innen.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2">
              Vorname *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="Vorname"
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-black"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Nachname"
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-black"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Telefonnummer *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Telefonnummer"
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email"
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="specialty" className="block text-sm font-medium mb-2">
              Fachgebiet *
            </label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              required
              placeholder="Fachgebiet"
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2 text-black"
            />
          </div>
          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-400 text-black font-bold px-6 py-2 rounded-sm hover:bg-yellow-500 disabled:opacity-50"
            >
              {loading ? "Senden..." : "Buchen Sie eine kostenlose Demo!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
