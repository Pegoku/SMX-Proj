'use client'

import { useState } from 'react';
import Image from 'next/image';

interface Material {
  id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  unit: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  is_available: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  display_order: number;
}

interface MaterialsGridProps {
  materials: Material[];
  categories: Category[];
}

export default function MaterialsGrid({ materials, categories }: MaterialsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const filteredMaterials = materials
    .filter((material) => {
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (material.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Cerca materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tots
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.name
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex justify-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="name">Ordenar per nom</option>
            <option value="price-asc">Preu: de menor a major</option>
            <option value="price-desc">Preu: de major a menor</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 text-center mb-6">
        {filteredMaterials.length} {filteredMaterials.length === 1 ? 'producte trobat' : 'productes trobats'}
      </p>

      {/* Materials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className={`bg-white rounded-xl overflow-hidden shadow-md card-hover ${
              !material.is_available ? 'opacity-75' : ''
            }`}
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              {material.image_url ? (
                <Image
                  src={material.image_url}
                  alt={material.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              {/* Category Badge */}
              <span className="absolute top-3 left-3 bg-[var(--primary)] text-white text-xs font-medium px-2 py-1 rounded-full">
                {material.category}
              </span>
              {/* Stock Badge */}
              {!material.is_available || material.stock_quantity <= 0 ? (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Esgotat
                </span>
              ) : material.stock_quantity < 10 ? (
                <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Poques unitats
                </span>
              ) : null}
            </div>

            {/* Content */}
            <div className="p-4">
              {material.brand && (
                <span className="text-xs text-[var(--secondary)] font-medium uppercase tracking-wider">
                  {material.brand}
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{material.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
              
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-bold text-[var(--primary)]">
                    {formatPrice(material.price)}
                  </span>
                  <span className="text-gray-500 text-sm">/{material.unit}</span>
                </div>
                {material.is_available && material.stock_quantity > 0 && (
                  <span className="text-xs text-gray-500">
                    {material.stock_quantity} en stock
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500 mb-2">No s'han trobat productes.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-[var(--primary)] font-medium hover:underline"
          >
            Eliminar filtres
          </button>
        </div>
      )}
    </div>
  );
}
