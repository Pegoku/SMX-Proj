'use client'

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitContactForm } from "../actions";

const initialState = {
  message: "",
  success: false,
};

const subjectOptions = [
  { value: "", label: "Selecciona" },
  { value: "Pintura Interior", label: "Pintura Interior" },
  { value: "Pintura Exterior", label: "Pintura Exterior" },
  { value: "Carpinteria", label: "Carpinteria" },
  { value: "Barnissat", label: "Barnissat" },
  { value: "Consulta materials", label: "Consulta materials" },
  { value: "Altres", label: "Altres" },
];

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const searchParams = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    const servei = searchParams.get("servei");
    if (servei) {
      // Find matching option
      const match = subjectOptions.find(opt => 
        opt.value.toLowerCase() === servei.toLowerCase()
      );
      if (match) {
        setSelectedSubject(match.value);
      }
    }
  }, [searchParams]);

  return (
    <form action={formAction} className="bg-white border border-gray-200 rounded-lg p-6">
      {state.message && (
        <div className={`p-3 mb-4 rounded text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">
            Telèfon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm text-gray-700 mb-1">
            Assumpte *
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:border-[var(--primary)]"
          >
            {subjectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm text-gray-700 mb-1">
          Missatge *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] resize-none"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="flex items-start space-x-2 text-sm">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-0.5"
          />
          <span className="text-gray-600">
            Accepto la política de privacitat
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {isPending ? 'Enviant...' : 'Enviar'}
      </button>
    </form>
  );
}
