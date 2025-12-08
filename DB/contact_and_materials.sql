-- Enable UUID extension (must be run as superuser or have appropriate privileges)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact Conversations System (for email back-and-forth)
-- This replaces/enhances the basic contact_messages table

CREATE TABLE IF NOT EXISTS contact_threads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    email           VARCHAR(150)        NOT NULL,
    phone           VARCHAR(50),
    subject         VARCHAR(255)        NOT NULL,
    status          VARCHAR(30)         NOT NULL DEFAULT 'open', -- open, replied, closed
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_threads_email ON contact_threads (email);
CREATE INDEX IF NOT EXISTS idx_contact_threads_status ON contact_threads (status);

-- Messages within a contact thread
CREATE TABLE IF NOT EXISTS contact_messages_v2 (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id       UUID                NOT NULL,
    sender_type     VARCHAR(20)         NOT NULL, -- 'customer' or 'business'
    sender_email    VARCHAR(150)        NOT NULL,
    message         TEXT                NOT NULL,
    email_sent      BOOLEAN             NOT NULL DEFAULT FALSE,
    email_sent_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_message_thread
        FOREIGN KEY (thread_id) REFERENCES contact_threads(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_thread ON contact_messages_v2 (thread_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages_v2 (created_at);

-- Materials / Inventory
CREATE TABLE IF NOT EXISTS materials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    description     TEXT,
    category        VARCHAR(100),       -- e.g. 'Pintura', 'Herramientas', 'Materiales de construcción'
    brand           VARCHAR(100),
    unit            VARCHAR(50)         NOT NULL DEFAULT 'unidad', -- 'litro', 'kg', 'unidad', 'm²', etc.
    price           NUMERIC(10,2)       NOT NULL DEFAULT 0,
    stock_quantity  NUMERIC(10,2)       NOT NULL DEFAULT 0,
    min_stock       NUMERIC(10,2)       DEFAULT 0,
    image_url       TEXT,
    is_available    BOOLEAN             NOT NULL DEFAULT TRUE,
    is_visible      BOOLEAN             NOT NULL DEFAULT TRUE, -- for public display
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_category ON materials (category);
CREATE INDEX IF NOT EXISTS idx_materials_available ON materials (is_available);
CREATE INDEX IF NOT EXISTS idx_materials_visible ON materials (is_visible);

-- Material categories for organization
CREATE TABLE IF NOT EXISTS material_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)        NOT NULL UNIQUE,
    description     TEXT,
    display_order   INT                 NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- Insert default categories
INSERT INTO material_categories (name, description, display_order) VALUES
    ('Pintures', 'Pintures i esmalts per a interiors i exteriors', 1),
    ('Eines', 'Eines de pintura i reforma', 2),
    ('Materials de Construcció', 'Materials per a reformes i construcció', 3),
    ('Acabats', 'Materials d''acabat i decoració', 4),
    ('Imprimacions', 'Imprimacions i preparacions', 5)
ON CONFLICT (name) DO NOTHING;


CREATE TABLE IF NOT EXISTS service_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    email           VARCHAR(150)        NOT NULL,
    phone           VARCHAR(50),
    service_type    VARCHAR(100)        NOT NULL, -- e.g. 'Pintura', 'Reforma', etc.
    description     TEXT,
    preferred_date  TIMESTAMPTZ,
    status          VARCHAR(30)         NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

ALTER TABLE service_requests
    ADD COLUMN IF NOT EXISTS message TEXT;

-- Migrate data if needed (only if old columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_requests' AND column_name='client_name') THEN
        UPDATE service_requests SET name = client_name WHERE name IS NULL;
        UPDATE service_requests SET email = client_email WHERE email IS NULL;
        UPDATE service_requests SET phone = client_phone WHERE phone IS NULL;
    END IF;
END $$;
