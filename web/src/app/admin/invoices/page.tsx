export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  getAllInvoices,
  getAllClients,
  getAllInvoiceProducts,
} from "./actions";
import InvoiceEditor from "./InvoiceEditor";

export default async function InvoicesPage() {
  const [invoices, clients, products] = await Promise.all([
    getAllInvoices(),
    getAllClients(),
    getAllInvoiceProducts(),
  ]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestió de Factures
          </h1>
        </div>
        <InvoiceEditor
          initialInvoices={invoices}
          initialClients={clients}
          initialProducts={products}
        />
      </div>
    </div>
  );
}
