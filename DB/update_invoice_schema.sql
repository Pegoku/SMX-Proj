-- Add NIF field to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS nif VARCHAR(20);

-- Add unit column to invoice_items
ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'unitat';

-- Add tax_rate and labor_total to invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) DEFAULT 21.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS labor_total NUMERIC(12,2) DEFAULT 0;

-- Create invoice_products table for reusable products/items
CREATE TABLE IF NOT EXISTS invoice_products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255)        NOT NULL,
    description     TEXT,
    default_price   NUMERIC(12,2)       NOT NULL DEFAULT 0,
    default_unit    VARCHAR(20)         NOT NULL DEFAULT 'unitat',
    category        VARCHAR(100),
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoice_products_name ON invoice_products (name);
CREATE INDEX IF NOT EXISTS idx_invoice_products_category ON invoice_products (category);
CREATE INDEX IF NOT EXISTS idx_invoice_products_active ON invoice_products (is_active);
