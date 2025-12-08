import { getThreads, getThreadMessages } from '@/app/actions';
import { notFound } from 'next/navigation';
import ThreadReplyForm from './ThreadReplyForm';

interface ThreadPageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { threadId } = await params;
  const threads = await getThreads();
  const thread = threads.find(t => t.id === threadId);
  
  if (!thread) {
    notFound();
  }
  
  const messages = await getThreadMessages(threadId);
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Conversa amb {thread.name}
              </h1>
              <p className="text-gray-600">{thread.email}</p>
              {thread.phone && <p className="text-gray-600">Tel: {thread.phone}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              thread.status === 'new' ? 'bg-blue-100 text-blue-800' :
              thread.status === 'replied' ? 'bg-green-100 text-green-800' :
              thread.status === 'closed' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {thread.status === 'new' ? 'Nou' :
               thread.status === 'replied' ? 'Respost' :
               thread.status === 'closed' ? 'Tancat' : thread.status}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Assumpte: {thread.subject}
          </p>
          <p className="text-sm text-gray-500">
            Creat: {new Date(thread.created_at).toLocaleString('ca-ES')}
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${
                msg.sender_type === 'customer' 
                  ? 'bg-gray-50 border-l-4 border-blue-500' 
                  : 'bg-orange-50 border-l-4 border-orange-500 ml-8'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-700">
                  {msg.sender_type === 'customer' ? thread.name : 'Tu'}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(msg.created_at).toLocaleString('ca-ES')}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
              {msg.sender_type === 'business' && (
                <p className="text-xs text-gray-500 mt-2">
                  {msg.email_sent ? '✓ Email enviat' : '⏳ Pendent d\'enviar'}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {thread.status !== 'closed' && (
          <ThreadReplyForm threadId={threadId} />
        )}
        
        <div className="mt-6">
          <a 
            href="/admin/threads" 
            className="text-orange-600 hover:text-orange-700 flex items-center gap-2"
          >
            ← Tornar a la llista
          </a>
        </div>
      </div>
    </div>
  );
}
