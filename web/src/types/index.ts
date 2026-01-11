export interface Material {
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

export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  before_image_url?: string;
  after_image_url?: string;
  category?: string;
  service_id?: string;
  display_order?: number;
}

export interface ContactThread {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  status: "open" | "replied" | "closed";
  created_at: Date;
  updated_at: Date;
}

export interface ContactMessage {
  id: string;
  thread_id: string;
  sender_type: "customer" | "business";
  sender_email: string;
  message: string;
  email_sent: boolean;
  email_sent_at?: Date;
  created_at: Date;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  features?: string[];
  base_price?: number;
  display_order?: number;
  slug?: string;
  icon?: string;
  is_active: boolean;
}

export interface EmailQueueItem {
  id: string;
  thread_id?: string;
  to_email: string;
  from_name: string;
  subject: string;
  body_text: string;
  body_html?: string;
  status: "pending" | "sent" | "failed";
  attempts: number;
  created_at: Date;
}

export interface Client {
  id: string;
  name: string;
  nif?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id?: string;
  number: string;
  issue_date: string;
  due_date?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  labor_total?: number;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  client?: Client;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  service_id?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
}

export interface InvoiceProduct {
  id: string;
  name: string;
  description?: string;
  default_price: number;
  default_unit: string;
  category?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
