'use server';

import sql from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Client, Invoice, InvoiceItem, InvoiceProduct } from "@/types";

// =====================================================
// CLIENT CRUD
// =====================================================

export async function getAllClients(): Promise<Client[]> {
  try {
    const clients = await sql`
      SELECT id, name, nif, email, phone, address_line1, address_line2, city, postal_code, notes, created_at, updated_at
      FROM clients
      ORDER BY name ASC
    `;
    return clients as unknown as Client[];
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return [];
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const clients = await sql`
      SELECT id, name, nif, email, phone, address_line1, address_line2, city, postal_code, notes, created_at, updated_at
      FROM clients
      WHERE id = ${id}
    `;
    return clients.length > 0 ? (clients[0] as unknown as Client) : null;
  } catch (error) {
    console.error('Failed to fetch client:', error);
    return null;
  }
}

export async function createClient(data: {
  name: string;
  nif?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string; client?: Client }> {
  try {
    const result = await sql`
      INSERT INTO clients (name, nif, email, phone, address_line1, address_line2, city, postal_code, notes)
      VALUES (${data.name}, ${data.nif || null}, ${data.email || null}, ${data.phone || null}, 
              ${data.address_line1 || null}, ${data.address_line2 || null}, ${data.city || null}, 
              ${data.postal_code || null}, ${data.notes || null})
      RETURNING id, name, nif, email, phone, address_line1, address_line2, city, postal_code, notes, created_at, updated_at
    `;
    revalidatePath('/admin/invoices');
    return { success: true, client: result[0] as unknown as Client };
  } catch (error) {
    console.error('Failed to create client:', error);
    return { success: false, error: 'Error creant el client' };
  }
}

export async function updateClient(
  id: string,
  data: {
    name?: string;
    nif?: string;
    email?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    postal_code?: string;
    notes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE clients SET
        name = COALESCE(${data.name ?? null}, name),
        nif = COALESCE(${data.nif ?? null}, nif),
        email = COALESCE(${data.email ?? null}, email),
        phone = COALESCE(${data.phone ?? null}, phone),
        address_line1 = COALESCE(${data.address_line1 ?? null}, address_line1),
        address_line2 = COALESCE(${data.address_line2 ?? null}, address_line2),
        city = COALESCE(${data.city ?? null}, city),
        postal_code = COALESCE(${data.postal_code ?? null}, postal_code),
        notes = COALESCE(${data.notes ?? null}, notes),
        updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to update client:', error);
    return { success: false, error: 'Error actualitzant el client' };
  }
}

export async function deleteClient(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`DELETE FROM clients WHERE id = ${id}`;
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete client:', error);
    return { success: false, error: 'Error eliminant el client (pot tenir factures associades)' };
  }
}

// =====================================================
// INVOICE PRODUCTS CRUD
// =====================================================

export async function getAllInvoiceProducts(): Promise<InvoiceProduct[]> {
  try {
    const products = await sql`
      SELECT id, name, description, default_price, default_unit, category, is_active, created_at, updated_at
      FROM invoice_products
      WHERE is_active = TRUE
      ORDER BY category, name ASC
    `;
    return products as unknown as InvoiceProduct[];
  } catch (error) {
    console.error('Failed to fetch invoice products:', error);
    return [];
  }
}

export async function createInvoiceProduct(data: {
  name: string;
  description?: string;
  default_price: number;
  default_unit: string;
  category?: string;
}): Promise<{ success: boolean; error?: string; product?: InvoiceProduct }> {
  try {
    const result = await sql`
      INSERT INTO invoice_products (name, description, default_price, default_unit, category)
      VALUES (${data.name}, ${data.description || null}, ${data.default_price}, ${data.default_unit}, ${data.category || null})
      RETURNING id, name, description, default_price, default_unit, category, is_active, created_at, updated_at
    `;
    revalidatePath('/admin/invoices');
    return { success: true, product: result[0] as unknown as InvoiceProduct };
  } catch (error) {
    console.error('Failed to create invoice product:', error);
    return { success: false, error: 'Error creant el producte' };
  }
}

export async function updateInvoiceProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    default_price?: number;
    default_unit?: string;
    category?: string;
    is_active?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE invoice_products SET
        name = COALESCE(${data.name ?? null}, name),
        description = COALESCE(${data.description ?? null}, description),
        default_price = COALESCE(${data.default_price ?? null}, default_price),
        default_unit = COALESCE(${data.default_unit ?? null}, default_unit),
        category = COALESCE(${data.category ?? null}, category),
        is_active = COALESCE(${data.is_active ?? null}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to update invoice product:', error);
    return { success: false, error: 'Error actualitzant el producte' };
  }
}

export async function deleteInvoiceProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`UPDATE invoice_products SET is_active = FALSE WHERE id = ${id}`;
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete invoice product:', error);
    return { success: false, error: 'Error eliminant el producte' };
  }
}

// =====================================================
// INVOICE CRUD
// =====================================================

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await sql`
    SELECT COUNT(*) as count 
    FROM invoices 
    WHERE EXTRACT(YEAR FROM created_at) = ${year}
  `;
  const count = parseInt(result[0].count as string) + 1;
  return `${year}-${count.toString().padStart(3, '0')}`;
}

export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    const invoices = await sql`
      SELECT 
        i.id, i.client_id, i.project_id, i.number, i.issue_date, i.due_date, 
        i.status, i.subtotal, i.tax_rate, i.tax_amount, i.total, i.notes, i.labor_total,
        i.created_at, i.updated_at,
        c.name as client_name, c.nif as client_nif, c.email as client_email, 
        c.phone as client_phone, c.address_line1 as client_address, c.city as client_city,
        c.postal_code as client_postal_code
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      ORDER BY i.created_at DESC
    `;
    return invoices.map(inv => ({
      ...inv,
      client: {
        id: inv.client_id,
        name: inv.client_name,
        nif: inv.client_nif,
        email: inv.client_email,
        phone: inv.client_phone,
        address_line1: inv.client_address,
        city: inv.client_city,
        postal_code: inv.client_postal_code,
      }
    })) as unknown as Invoice[];
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return [];
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const invoices = await sql`
      select 
        i.id, i.client_id, i.project_id, i.number, i.issue_date, i.due_date, 
        i.status, i.subtotal, i.tax_rate, i.tax_amount, i.total, i.notes, i.labor_total,
        i.created_at, i.updated_at,
        c.name as client_name, c.nif as client_nif, c.email as client_email, 
        c.phone as client_phone, c.address_line1 as client_address, c.city as client_city,
        c.postal_code as client_postal_code, c.address_line2 as client_address2
      from invoices i
      left join clients c on i.client_id = c.id
      where i.id = ${id}
    `;
    
    if (invoices.length === 0) return null;
    
    const items = await sql`
      select id, invoice_id, service_id, description, quantity, unit, unit_price, line_total
      from invoice_items
      where invoice_id = ${id}
      order by id asc
    `;
    // console.log('fetched items for invoice', items, id);
    
    const inv = invoices[0];
    return {
      ...inv,
      client: {
        id: inv.client_id,
        name: inv.client_name,
        nif: inv.client_nif,
        email: inv.client_email,
        phone: inv.client_phone,
        address_line1: inv.client_address,
        address_line2: inv.client_address2,
        city: inv.client_city,
        postal_code: inv.client_postal_code,
      },
      items: items as unknown as InvoiceItem[],
    } as unknown as Invoice;
  } catch (error) {
    console.error('failed to fetch invoice:', error);
    return null;
  }
}

export async function getInvoiceItemsById(id: string): Promise<InvoiceItem[]> {
    try{
        const items = await sql`
        select id, invoice_id, service_id, description, quantity, unit, unit_price, line_total
        from invoice_items
        where invoice_id = ${id}
        order by id asc
      `;
      return items as unknown as InvoiceItem[];
    } catch (error) {
        console.error('failed to fetch invoice items:', error);
        return [];
    }
}

export async function createInvoice(data: {
  client_id: string;
  issue_date: string;
  due_date?: string;
  status?: string;
  notes?: string;
  tax_rate?: number;
  labor_total?: number;
  items: {
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
  }[];
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const taxRate = data.tax_rate ?? 21;
    const laborTotal = data.labor_total ?? 0;
    
    // Calculate totals
    const itemsSubtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const subtotal = itemsSubtotal + laborTotal;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    // Create invoice
    const result = await sql`
      INSERT INTO invoices (client_id, number, issue_date, due_date, status, subtotal, tax_rate, tax_amount, total, notes, labor_total)
      VALUES (${data.client_id}, ${invoiceNumber}, ${data.issue_date}, ${data.due_date || null}, 
              ${data.status || 'draft'}, ${subtotal}, ${taxRate}, ${taxAmount}, ${total}, ${data.notes || null}, ${laborTotal})
      RETURNING id
    `;
    
    const invoiceId = result[0].id;
    
    // Create invoice items
    for (const item of data.items) {
      const lineTotal = item.quantity * item.unit_price;
      await sql`
        INSERT INTO invoice_items (invoice_id, description, quantity, unit, unit_price, line_total)
        VALUES (${invoiceId}, ${item.description}, ${item.quantity}, ${item.unit}, ${item.unit_price}, ${lineTotal})
      `;
    }
    
    revalidatePath('/admin/invoices');
    return { success: true, id: invoiceId as string };
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return { success: false, error: 'Error creant la factura' };
  }
}

export async function updateInvoice(
  id: string,
  data: {
    client_id?: string;
    issue_date?: string;
    due_date?: string;
    status?: string;
    notes?: string;
    tax_rate?: number;
    labor_total?: number;
    items?: {
      id?: string;
      description: string;
      quantity: number;
      unit: string;
      unit_price: number;
    }[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const taxRate = data.tax_rate ?? 21;
    const laborTotal = data.labor_total ?? 0;
    
    // Calculate totals if items provided
    let subtotal = 0;
    let taxAmount = 0;
    let total = 0;
    
    if (data.items) {
      const itemsSubtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      subtotal = itemsSubtotal + laborTotal;
      taxAmount = subtotal * (taxRate / 100);
      total = subtotal + taxAmount;
      
      // Delete existing items and recreate
      await sql`DELETE FROM invoice_items WHERE invoice_id = ${id}`;
      
      for (const item of data.items) {
        const lineTotal = item.quantity * item.unit_price;
        await sql`
          INSERT INTO invoice_items (invoice_id, description, quantity, unit, unit_price, line_total)
          VALUES (${id}, ${item.description}, ${item.quantity}, ${item.unit}, ${item.unit_price}, ${lineTotal})
        `;
      }
    }
    await sql`
      UPDATE invoices SET
        client_id = COALESCE(${data.client_id ?? null}, client_id),
        issue_date = COALESCE(${data.issue_date ?? null}, issue_date),
        due_date = ${data.due_date || null},
        status = COALESCE(${data.status ?? null}, status),
        notes = COALESCE(${data.notes ?? null}, notes),
        tax_rate = ${taxRate},
        labor_total = ${laborTotal},
        subtotal = ${subtotal > 0 ? subtotal : sql`subtotal`},
        tax_amount = ${taxAmount > 0 ? taxAmount : sql`tax_amount`},
        total = ${total > 0 ? total : sql`total`},
        updated_at = NOW()
      WHERE id = ${id}
    `;
    
    revalidatePath('/admin/invoices');
    revalidatePath(`/admin/invoices/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return { success: false, error: 'Error actualitzant la factura' };
  }
}

export async function deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    return { success: false, error: 'Error eliminant la factura' };
  }
}

export async function updateInvoiceStatus(
  id: string,
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE invoices SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to update invoice status:', error);
    return { success: false, error: 'Error actualitzant l\'estat' };
  }
}
