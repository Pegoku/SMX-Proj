// Force dynamic rendering so admin thread list isn't prerendered at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { getThreads } from '@/app/actions';
import { getAllPortfolioItems, getAllMaterials, getAllServices } from './actions';
import { getAllInvoices } from './invoices/actions';

export default async function AdminPage() {
  const [threads, portfolio, materials, services, invoices] = await Promise.all([
    getThreads(),
    getAllPortfolioItems(),
    getAllMaterials(),
    getAllServices(),
    getAllInvoices(),
  ]);

  const newThreads = threads.filter(t => t.status === 'new').length;
  const pendingInvoices = invoices.filter(i => i.status === 'draft' || i.status === 'sent').length;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Benvingut al Panel d&apos;Administració
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Threads Card */}
          <Link href="/admin/threads" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Consultes</p>
                <p className="text-3xl font-bold text-gray-800">{threads.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
            </div>
            {newThreads > 0 && (
              <p className="text-sm text-blue-600 mt-2">{newThreads} noves</p>
            )}
          </Link>

          {/* Invoices Card */}
          <Link href="/admin/invoices" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Factures</p>
                <p className="text-3xl font-bold text-gray-800">{invoices.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
            {pendingInvoices > 0 && (
              <p className="text-sm text-yellow-600 mt-2">{pendingInvoices} pendents</p>
            )}
          </Link>

          {/* Portfolio Card */}
          <Link href="/admin/portfolio" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Treballs</p>
                <p className="text-3xl font-bold text-gray-800">{portfolio.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
            </div>
          </Link>

          {/* Materials Card */}
          <Link href="/admin/materials" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Materials</p>
                <p className="text-3xl font-bold text-gray-800">{materials.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
            </div>
          </Link>

          {/* Services Card */}
          <Link href="/admin/services" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Serveis</p>
                <p className="text-3xl font-bold text-gray-800">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Accions Ràpides</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
            >
              + Afegir Treball
            </Link>
            <Link
              href="/admin/materials"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              + Afegir Material
            </Link>
            <Link
              href="/admin/services"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              + Afegir Servei
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}
