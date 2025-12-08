'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ThreadReplyFormProps {
  threadId: string;
}

export default function ThreadReplyForm({ threadId }: ThreadReplyFormProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('El missatge no pot estar buit');
      return;
    }
    
    setSending(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || ''}`,
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('');
        router.refresh();
      } else {
        setError(data.error || 'Error enviant la resposta');
      }
    } catch (err) {
      setError('Error de connexió');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Enviar Resposta</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escriu la teva resposta..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          disabled={sending}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Enviant...' : 'Enviar Resposta'}
          </button>
        </div>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        ℹ️ La resposta s&apos;enviarà al client automàticament des del compte del bot.
      </p>
    </div>
  );
}
