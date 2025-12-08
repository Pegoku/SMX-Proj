'use client'

import { useActionState } from "react";
import { submitServiceRequest } from "../actions";

const initialState = {
  message: "",
  success: false,
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitServiceRequest, initialState);

  return (
    <form action={formAction} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
      
      {state.message && (
        <div className={`p-4 mb-4 rounded ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {isPending ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
