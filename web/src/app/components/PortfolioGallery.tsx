'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  before_image_url?: string;
  after_image_url?: string;
  category?: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

export default function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showBefore, setShowBefore] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const searchParams = useSearchParams();

  const categories = ['all', ...new Set(items.map(item => item.category).filter(Boolean))];

  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      // Find matching category (case insensitive)
      const match = categories.find(cat => 
        cat && cat.toLowerCase() === urlFilter.toLowerCase()
      );
      if (match) {
        setFilter(match);
      }
    }
  }, [searchParams, categories]);
  
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category as string)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === category
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Tots' : category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedItem(item)}
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Imatge</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              {item.category && (
                <span className="inline-block mt-2 text-xs text-[var(--secondary)]">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hi ha projectes en aquesta categoria.</p>
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedItem(null);
            setShowBefore(false);
          }}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{selectedItem.title}</h2>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setShowBefore(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="h-64 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-400">
                  {showBefore ? 'Imatge Abans' : 'Imatge Després'}
                </span>
              </div>

              {selectedItem.before_image_url && selectedItem.after_image_url && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowBefore(true)}
                    className={`px-3 py-1 rounded text-sm ${
                      showBefore ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Abans
                  </button>
                  <button
                    onClick={() => setShowBefore(false)}
                    className={`px-3 py-1 rounded text-sm ${
                      !showBefore ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Després
                  </button>
                </div>
              )}

              <p className="text-gray-600">{selectedItem.description}</p>
              {selectedItem.category && (
                <p className="text-sm text-[var(--secondary)] mt-2">{selectedItem.category}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
