'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Invoice, Client, InvoiceProduct } from '@/types';
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  createClient,
  createInvoiceProduct,
} from './actions';

interface InvoiceEditorProps {
  initialInvoices: Invoice[];
  initialClients: Client[];
  initialProducts: InvoiceProduct[];
}

interface InvoiceItemForm {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

const units = ['unitat', 'hora', 'm²', 'm', 'kg', 'litre', 'pack'];

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Esborrany', color: 'bg-gray-100 text-gray-800' },
  sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pagada', color: 'bg-green-100 text-green-800' },
  overdue: { label: 'Vençuda', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Cancel·lada', color: 'bg-gray-100 text-gray-500' },
};

export default function InvoiceEditor({
  initialInvoices,
  initialClients,
  initialProducts,
}: InvoiceEditorProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [clients, setClients] = useState(initialClients);
  const [products, setProducts] = useState(initialProducts);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    client_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft',
    notes: '',
    tax_rate: 21,
    labor_total: 0,
    items: [] as InvoiceItemForm[],
  });

  const [newClientForm, setNewClientForm] = useState({
    name: '',
    nif: '',
    email: '',
    phone: '',
    address_line1: '',
    city: '',
    postal_code: '',
  });

  const [newProductForm, setNewProductForm] = useState({
    name: '',
    description: '',
    default_price: 0,
    default_unit: 'unitat',
    category: '',
  });

  const resetForm = useCallback(() => {
    setFormData({
      client_id: '',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: '',
      status: 'draft',
      notes: '',
      tax_rate: 21,
      labor_total: 0,
      items: [],
    });
    setEditingInvoice(null);
    setIsCreating(false);
    setError('');
  }, []);

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsCreating(false);
    setFormData({
      client_id: invoice.client_id,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date || '',
      status: invoice.status,
      notes: invoice.notes || '',
      tax_rate: invoice.tax_rate || 21,
      labor_total: invoice.labor_total || 0,
      items: invoice.items?.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit: item.unit || 'unitat',
        unit_price: item.unit_price,
      })) || [],
    });
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit: 'unitat', unit_price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: keyof InvoiceItemForm, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addProductAsItem = (product: InvoiceProduct) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: product.name,
          quantity: 1,
          unit: product.default_unit,
          unit_price: product.default_price,
        },
      ],
    });
  };

  const calculateSubtotal = () => {
    const itemsTotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    return itemsTotal + (formData.labor_total || 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.tax_rate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.client_id) {
      setError('Has de seleccionar un client');
      setLoading(false);
      return;
    }

    if (formData.items.length === 0 && formData.labor_total === 0) {
      setError('Has d\'afegir almenys un article o mà d\'obra');
      setLoading(false);
      return;
    }

    try {
      if (editingInvoice) {
        const result = await updateInvoice(editingInvoice.id, formData);
        if (!result.success) {
          setError(result.error || 'Error actualitzant');
          return;
        }
      } else {
        const result = await createInvoice(formData);
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
    if (!confirm('Estàs segur que vols eliminar aquesta factura?')) return;

    setLoading(true);
    try {
      const result = await deleteInvoice(id);
      if (!result.success) {
        setError(result.error || 'Error eliminant');
        return;
      }
      router.refresh();
    } catch {
      setError('Error inesperat');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(true);
    try {
      const result = await updateInvoiceStatus(
        id,
        status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
      );
      if (!result.success) {
        setError(result.error || 'Error actualitzant estat');
        return;
      }
      router.refresh();
    } catch {
      setError('Error inesperat');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createClient(newClientForm);
      if (!result.success) {
        setError(result.error || 'Error creant client');
        return;
      }
      if (result.client) {
        setClients([...clients, result.client]);
        setFormData({ ...formData, client_id: result.client.id });
      }
      setNewClientForm({
        name: '',
        nif: '',
        email: '',
        phone: '',
        address_line1: '',
        city: '',
        postal_code: '',
      });
      setShowClientModal(false);
    } catch {
      setError('Error inesperat');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createInvoiceProduct(newProductForm);
      if (!result.success) {
        setError(result.error || 'Error creant producte');
        return;
      }
      if (result.product) {
        setProducts([...products, result.product]);
      }
      setNewProductForm({
        name: '',
        description: '',
        default_price: 0,
        default_unit: 'unitat',
        category: '',
      });
      setShowProductModal(false);
    } catch {
      setError('Error inesperat');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(
    inv =>
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClient = clients.find(c => c.id === formData.client_id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Factures</h1>
        {!isCreating && !editingInvoice && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Nova Factura
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingInvoice) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingInvoice ? `Editar Factura ${editingInvoice.number}` : 'Nova Factura'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.client_id}
                    onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Selecciona un client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.nif ? `(${client.nif})` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowClientModal(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Nou
                  </button>
                </div>
                {selectedClient && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                    <p><strong>{selectedClient.name}</strong></p>
                    {selectedClient.nif && <p>NIF: {selectedClient.nif}</p>}
                    {selectedClient.address_line1 && <p>{selectedClient.address_line1}</p>}
                    {selectedClient.city && <p>{selectedClient.postal_code} {selectedClient.city}</p>}
                    {selectedClient.phone && <p>Tel: {selectedClient.phone}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Factura *
                  </label>
                  <input
                    type="date"
                    value={formData.issue_date}
                    onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estat
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {Object.entries(statusLabels).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Articles
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(true)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    + Crear Producte
                  </button>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Afegir Línia
                  </button>
                </div>
              </div>

              {/* Products Quick Add */}
              {products.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Afegir producte guardat:</p>
                  <div className="flex flex-wrap gap-2">
                    {products.map(product => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => addProductAsItem(product)}
                        className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
                      >
                        {product.name} ({product.default_price.toFixed(2)}€/{product.default_unit})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Concepte
                      </th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700 w-20">
                        Unitat
                      </th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700 w-20">
                        Qttat
                      </th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700 w-24">
                        Preu
                      </th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700 w-24">
                        Total
                      </th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={e => updateItem(index, 'description', e.target.value)}
                            className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500"
                            placeholder="Descripció..."
                          />
                        </td>
                        <td className="px-2 py-2">
                          <select
                            value={item.unit}
                            onChange={e => updateItem(index, 'unit', e.target.value)}
                            className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500 text-sm"
                          >
                            {units.map(u => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={e =>
                              updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                            }
                            className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500 text-center"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={e =>
                              updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)
                            }
                            className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500 text-right"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {(item.quantity * item.unit_price).toFixed(2)}€
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Cap article afegit. Afegeix articles o mà d&apos;obra.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Labor and Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Mà d&apos;Obra (€)
                </label>
                <input
                  type="number"
                  value={formData.labor_total}
                  onChange={e =>
                    setFormData({ ...formData, labor_total: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Imponible:</span>
                  <span className="font-medium">{calculateSubtotal().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between mb-2 items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    IVA
                    <input
                      type="number"
                      value={formData.tax_rate}
                      onChange={e =>
                        setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })
                      }
                      className="w-16 p-1 border rounded text-center text-sm"
                      step="0.5"
                      min="0"
                    />
                    %:
                  </span>
                  <span className="font-medium">{calculateTax().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="font-bold text-lg text-green-700">
                    {calculateTotal().toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Guardant...' : editingInvoice ? 'Actualitzar' : 'Crear Factura'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoices List */}
      {!isCreating && !editingInvoice && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Cercar per número o client..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-80 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nº</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estat</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Accions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{invoice.number}</td>
                    <td className="px-4 py-3">{invoice.client?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(invoice.issue_date).toLocaleDateString('ca-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={invoice.status}
                        onChange={e => handleStatusChange(invoice.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabels[invoice.status]?.color || ''}`}
                      >
                        {Object.entries(statusLabels).map(([value, { label }]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {Number(invoice.total).toFixed(2)}€
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          Editar
                        </button>
                        <a
                          href={`/api/admin/invoices/${invoice.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                        >
                          PDF
                        </a>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      {invoices.length === 0
                        ? 'No hi ha factures. Crea la primera!'
                        : 'No s\'han trobat factures'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Nou Client</h3>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={newClientForm.name}
                  onChange={e => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N.I.F.</label>
                  <input
                    type="text"
                    value={newClientForm.nif}
                    onChange={e => setNewClientForm({ ...newClientForm, nif: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telèfon</label>
                  <input
                    type="text"
                    value={newClientForm.phone}
                    onChange={e => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newClientForm.email}
                  onChange={e => setNewClientForm({ ...newClientForm, email: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domicili</label>
                <input
                  type="text"
                  value={newClientForm.address_line1}
                  onChange={e =>
                    setNewClientForm({ ...newClientForm, address_line1: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codi Postal</label>
                  <input
                    type="text"
                    value={newClientForm.postal_code}
                    onChange={e =>
                      setNewClientForm({ ...newClientForm, postal_code: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Població</label>
                  <input
                    type="text"
                    value={newClientForm.city}
                    onChange={e => setNewClientForm({ ...newClientForm, city: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Guardant...' : 'Crear Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Nou Producte/Servei</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={newProductForm.name}
                  onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripció</label>
                <textarea
                  value={newProductForm.description}
                  onChange={e =>
                    setNewProductForm({ ...newProductForm, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preu per defecte (€)
                  </label>
                  <input
                    type="number"
                    value={newProductForm.default_price}
                    onChange={e =>
                      setNewProductForm({
                        ...newProductForm,
                        default_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unitat</label>
                  <select
                    value={newProductForm.default_unit}
                    onChange={e =>
                      setNewProductForm({ ...newProductForm, default_unit: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    {units.map(u => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={newProductForm.category}
                  onChange={e =>
                    setNewProductForm({ ...newProductForm, category: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ex: Pintura, Fusteria..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Guardant...' : 'Crear Producte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
