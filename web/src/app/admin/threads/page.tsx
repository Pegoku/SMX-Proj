// Force dynamic rendering so admin thread list isn't prerendered at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getThreads } from '@/app/actions';
import Link from 'next/link';
import ThreadsTable from './ThreadsTable';

export default async function ThreadsPage() {
  const threads = await getThreads();
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestió de Consultes
          </h1>
          <Link 
            href="/"
            className="text-orange-600 hover:text-orange-700"
          >
            ← Tornar al web
          </Link>
        </div>
        
        {threads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No hi ha consultes pendents.</p>
          </div>
        ) : (
          <ThreadsTable initialThreads={threads} />
        )}
      </div>
    </div>
  );
}
