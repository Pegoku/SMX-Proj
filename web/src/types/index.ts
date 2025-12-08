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
  display_order?: number;
}

export interface ContactThread {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  status: 'open' | 'replied' | 'closed';
  created_at: Date;
  updated_at: Date;
}

export interface ContactMessage {
  id: string;
  thread_id: string;
  sender_type: 'customer' | 'business';
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
  base_price?: number;
  is_active: boolean;
}
