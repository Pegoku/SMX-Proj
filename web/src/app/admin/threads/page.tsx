import { getThreads } from '@/app/actions';
import Link from 'next/link';

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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assumpte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {threads.map((thread) => (
                  <tr key={thread.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{thread.name}</div>
                        <div className="text-sm text-gray-500">{thread.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {thread.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        thread.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        thread.status === 'replied' ? 'bg-green-100 text-green-800' :
                        thread.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {thread.status === 'new' ? 'Nou' :
                         thread.status === 'replied' ? 'Respost' :
                         thread.status === 'closed' ? 'Tancat' : thread.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(thread.created_at).toLocaleDateString('ca-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/admin/threads/${thread.id}`}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Veure / Respondre
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
