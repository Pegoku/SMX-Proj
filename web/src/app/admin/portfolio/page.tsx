// Force dynamic rendering so admin portfolio page isn't prerendered at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getAllPortfolioItems } from '../actions';
import PortfolioEditor from './PortfolioEditor';

export default async function AdminPortfolioPage() {
  const items = await getAllPortfolioItems();

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestió de Treballs</h1>
        </div>
        <PortfolioEditor initialItems={items} />
      </div>
    </div>
  );
}
