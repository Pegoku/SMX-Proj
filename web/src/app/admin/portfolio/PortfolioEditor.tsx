'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PortfolioItem } from '@/types';
import { createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../actions';

interface PortfolioEditorProps {
  initialItems: PortfolioItem[];
}

const categories = ['Pintura Interior', 'Pintura Exterior', 'Carpinteria', 'Barnissat'];

export default function PortfolioEditor({ initialItems }: PortfolioEditorProps) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    before_image_url: '',
    after_image_url: '',
    category: '',
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      before_image_url: '',
      after_image_url: '',
      category: '',
      display_order: 0,
    });
    setEditingItem(null);
    setIsCreating(false);
    setError('');
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      before_image_url: item.before_image_url || '',
      after_image_url: item.after_image_url || '',
      category: item.category || '',
      display_order: item.display_order || 0,
    });
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingItem) {
        const result = await updatePortfolioItem(editingItem.id, formData);
        if (!result.success) {
          setError(result.error || 'Error actualitzant');
          return;
        }
      } else {
        const result = await createPortfolioItem(formData);
        if (!result.success) {
          setError(result.error || 'Error creant');
          return;
        }
      }
      resetForm();
      router.refresh();
    } catch {
      setError('Error inesperat');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Estàs segur que vols eliminar aquest treball?')) return;

    setLoading(true);
    try {
      const result = await deletePortfolioItem(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Error eliminant');
      }
    } catch {
      setError('Error inesperat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Button */}
      {!isCreating && !editingItem && (
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          + Afegir Treball
        </button>
      )}

      {/* Form */}
      {(isCreating || editingItem) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingItem ? 'Editar Treball' : 'Nou Treball'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Títol *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecciona...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripció *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imatge Principal *</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imatge Abans</label>
                <input
                  type="url"
                  value={formData.before_image_url}
                  onChange={(e) => setFormData({ ...formData, before_image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imatge Després</label>
                <input
                  type="url"
                  value={formData.after_image_url}
                  onChange={(e) => setFormData({ ...formData, after_image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Guardant...' : editingItem ? 'Actualitzar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel·lar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imatge</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Títol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hi ha treballs. Afegeix-ne un!
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.category || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.display_order || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
