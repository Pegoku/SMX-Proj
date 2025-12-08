'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Service } from '@/types';
import { createService, updateService, deleteService } from '../actions';

interface ServicesEditorProps {
  initialServices: Service[];
}

export default function ServicesEditor({ initialServices }: ServicesEditorProps) {
  const [services, setServices] = useState(initialServices);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    base_price: '',
    display_order: 0,
    slug: '',
    icon: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      features: '',
      base_price: '',
      display_order: 0,
      slug: '',
      icon: '',
      is_active: true,
    });
    setEditingItem(null);
    setIsCreating(false);
    setError('');
  };

  const handleEdit = (item: Service) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData({
      name: item.name,
      description: item.description || '',
      features: item.features?.join('\n') || '',
      base_price: item.base_price?.toString() || '',
      display_order: item.display_order || 0,
      slug: item.slug || '',
      icon: item.icon || '',
      is_active: item.is_active,
    });
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const featuresArray = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const data = {
      name: formData.name,
      description: formData.description,
      features: featuresArray,
      base_price: formData.base_price ? parseFloat(formData.base_price) : undefined,
      display_order: formData.display_order,
      slug: formData.slug || generateSlug(formData.name),
      icon: formData.icon || undefined,
      is_active: formData.is_active,
    };

    try {
      if (editingItem) {
        const result = await updateService(editingItem.id, data);
        if (!result.success) {
          setError(result.error || 'Error actualitzant');
          return;
        }
      } else {
        const result = await createService(data);
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
    if (!confirm('Estàs segur que vols eliminar aquest servei?')) return;

    setLoading(true);
    try {
      const result = await deleteService(id);
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
          + Afegir Servei
        </button>
      )}

      {/* Form */}
      {(isCreating || editingItem) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingItem ? 'Editar Servei' : 'Nou Servei'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="pintura-interior"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Característiques (una per línia)
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={4}
                placeholder="Preparació de superfícies&#10;Pintura de parets&#10;Acabats professionals"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preu Base (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icona</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="paint-roller"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Servei actiu</span>
              </label>
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

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripció</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Característiques</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hi ha serveis. Afegeix-ne un!
                </td>
              </tr>
            ) : (
              services.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.features?.length || 0} ítems
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.display_order || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.is_active ? 'Actiu' : 'Inactiu'}
                    </span>
                  </td>
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
