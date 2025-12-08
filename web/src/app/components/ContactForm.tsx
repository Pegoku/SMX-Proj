'use client'

import { useActionState } from "react";
import { submitContactForm } from "../actions";

const initialState = {
  message: "",
  success: false,
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      {state.message && (
        <div className={`p-4 mb-6 rounded-lg ${state.success ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            {state.success ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{state.message}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="El teu nom"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Correu electrònic *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="el-teu@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
          Telèfon <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+34 600 000 000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
          Assumpte *
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all bg-white text-gray-900"
        >
          <option value="">Selecciona un assumpte</option>
          <option value="Pressupost pintura interior">Pressupost pintura interior</option>
          <option value="Pressupost pintura exterior">Pressupost pintura exterior</option>
          <option value="Pressupost reforma">Pressupost reforma</option>
          <option value="Consulta sobre materials">Consulta sobre materials</option>
          <option value="Altres consultes">Altres consultes</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
          Missatge *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Descriu el teu projecte o consulta..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-1 w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
          />
          <span className="text-sm text-gray-600">
            He llegit i accepto la{' '}
            <a href="/privacitat" className="text-[var(--primary)] hover:underline">
              política de privacitat
            </a>
            . Les teves dades seran tractades de forma confidencial.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Enviant...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Enviar Missatge</span>
          </>
        )}
      </button>
    </form>
  );
}
