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
        <InvoiceEditor
          initialInvoices={invoices}
          initialClients={clients}
          initialProducts={products}
        />
      </div>
    </div>
  );
}
