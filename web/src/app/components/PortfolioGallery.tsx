'use client'

import { useState } from 'react';
import Image from 'next/image';

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

  const categories = ['all', ...new Set(items.map(item => item.category).filter(Boolean))];
  
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category as string)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filter === category
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category === 'all' ? 'Tots' : category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden shadow-md card-hover cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative h-64 bg-gray-200">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                  <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {item.category && (
                <span className="absolute top-4 left-4 bg-[var(--primary)] text-white text-xs font-medium px-3 py-1 rounded-full">
                  {item.category}
                </span>
              )}
              {(item.before_image_url || item.after_image_url) && (
                <span className="absolute top-4 right-4 bg-white text-[var(--primary)] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Abans/Després
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No hi ha projectes en aquesta categoria.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedItem(null);
            setShowBefore(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setShowBefore(false);
                }}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative h-96 md:h-[500px] bg-gray-200">
                {selectedItem.before_image_url && selectedItem.after_image_url ? (
                  <>
                    <Image
                      src={showBefore ? selectedItem.before_image_url : selectedItem.after_image_url}
                      alt={`${selectedItem.title} - ${showBefore ? 'Abans' : 'Després'}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 900px"
                    />
                    {/* Before/After Toggle */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-lg flex">
                      <button
                        onClick={() => setShowBefore(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          showBefore ? 'bg-[var(--primary)] text-white' : 'text-gray-700'
                        }`}
                      >
                        Abans
                      </button>
                      <button
                        onClick={() => setShowBefore(false)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          !showBefore ? 'bg-[var(--primary)] text-white' : 'text-gray-700'
                        }`}
                      >
                        Després
                      </button>
                    </div>
                  </>
                ) : selectedItem.image_url ? (
                  <Image
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                    <svg className="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedItem.category && (
                <span className="inline-block bg-[var(--secondary-light)] text-[var(--primary)] text-xs font-medium px-3 py-1 rounded-full mb-3">
                  {selectedItem.category}
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{selectedItem.title}</h2>
              <p className="text-gray-600">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
