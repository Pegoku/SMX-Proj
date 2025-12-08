'use client'

import { useState } from 'react';

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

interface MaterialsGridProps {
  materials: Material[];
}

export default function MaterialsGrid({ materials }: MaterialsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...new Set(materials.map(m => m.category))];

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number, unit: string) => {
    return `${price.toFixed(2)} €/${unit}`;
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cerca materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[var(--primary)]"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Tots' : category}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{material.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${
                material.is_available 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {material.is_available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{material.description}</p>
            {material.brand && (
              <p className="text-xs text-gray-500 mb-2">{material.brand}</p>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-semibold text-[var(--primary)]">
                {formatPrice(material.price, material.unit)}
              </span>
              <span className="text-xs text-gray-500">
                Stock: {material.stock_quantity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No s'han trobat materials.</p>
        </div>
      )}
    </div>
  );
}
