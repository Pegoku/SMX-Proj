-- Schema Update v2: Dynamic Services, Materials, Portfolio + Bot Email System
-- Run this after update_schema.sql

-- =====================================================
-- 1) Update Services table with features and display info
-- =====================================================
ALTER TABLE services ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon VARCHAR(50);
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(100);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug ON services (slug) WHERE slug IS NOT NULL;

-- =====================================================
-- 2) Update Portfolio Items with category
-- =====================================================
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items (category);
CREATE INDEX IF NOT EXISTS idx_portfolio_service ON portfolio_items (service_id);

-- =====================================================
-- 3) Update Materials table with additional fields
-- =====================================================
CREATE TABLE IF NOT EXISTS materials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    description     TEXT,
    category        VARCHAR(100)        NOT NULL,
    brand           VARCHAR(100),
    unit            VARCHAR(50)         NOT NULL DEFAULT 'unitat',
    price           NUMERIC(10,2)       NOT NULL DEFAULT 0,
    stock_quantity  INT                 NOT NULL DEFAULT 0,
    image_url       TEXT,
    is_available    BOOLEAN             NOT NULL DEFAULT TRUE,
    is_visible      BOOLEAN             NOT NULL DEFAULT TRUE,
    display_order   INT                 NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_category ON materials (category);
CREATE INDEX IF NOT EXISTS idx_materials_available ON materials (is_available);
CREATE INDEX IF NOT EXISTS idx_materials_visible ON materials (is_visible);

-- =====================================================
-- 4) Contact Threads for conversation tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_threads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    email           VARCHAR(150)        NOT NULL,
    phone           VARCHAR(50),
    subject         VARCHAR(255)        NOT NULL,
    status          VARCHAR(20)         NOT NULL DEFAULT 'open',
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_thread_status CHECK (status IN ('open', 'replied', 'closed'))
);

CREATE INDEX IF NOT EXISTS idx_contact_threads_email ON contact_threads (email);
CREATE INDEX IF NOT EXISTS idx_contact_threads_status ON contact_threads (status);

-- =====================================================
-- 5) Contact Messages v2 for threaded conversations
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages_v2 (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id       UUID                NOT NULL REFERENCES contact_threads(id) ON DELETE CASCADE,
    sender_type     VARCHAR(20)         NOT NULL, -- 'customer' or 'business'
    sender_email    VARCHAR(150)        NOT NULL,
    message         TEXT                NOT NULL,
    email_sent      BOOLEAN             NOT NULL DEFAULT FALSE,
    email_sent_at   TIMESTAMPTZ,
    email_message_id VARCHAR(255),      -- For tracking email replies
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_sender_type CHECK (sender_type IN ('customer', 'business'))
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_thread ON contact_messages_v2 (thread_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email_id ON contact_messages_v2 (email_message_id);

-- =====================================================
-- 6) Email Queue for bot-mediated replies
-- =====================================================
CREATE TABLE IF NOT EXISTS email_queue (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id       UUID                REFERENCES contact_threads(id) ON DELETE CASCADE,
    to_email        VARCHAR(150)        NOT NULL,
    from_name       VARCHAR(150)        NOT NULL,
    subject         VARCHAR(255)        NOT NULL,
    body_text       TEXT                NOT NULL,
    body_html       TEXT,
    status          VARCHAR(20)         NOT NULL DEFAULT 'pending',
    attempts        INT                 NOT NULL DEFAULT 0,
    last_attempt    TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_email_status CHECK (status IN ('pending', 'sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue (status);
CREATE INDEX IF NOT EXISTS idx_email_queue_thread ON email_queue (thread_id);

-- =====================================================
-- 7) Insert default services
-- =====================================================
INSERT INTO services (name, description, features, display_order, slug, is_active) VALUES
(
    'Pintura Interior',
    'Pintura de parets, sostres i espais interiors. Preparació de superfícies, empastats i acabats professionals.',
    ARRAY['Preparació de superfícies', 'Pintura de parets i sostres', 'Pintura de portes i fusteries', 'Acabats especials'],
    1,
    'pintura-interior',
    true
),
(
    'Pintura Exterior',
    'Pintura de façanes i exteriors amb productes resistents a les condicions climàtiques de Menorca.',
    ARRAY['Pintura de façanes', 'Tractaments antihumitat', 'Reparació de fissures', 'Neteja de superfícies'],
    2,
    'pintura-exterior',
    true
),
(
    'Carpinteria',
    'Arreglos de fusteria en general. Portes, finestres, mobles i altres elements de fusta.',
    ARRAY['Reparació de portes', 'Arreglo de finestres', 'Restauració de mobles', 'Treballs a mida'],
    3,
    'carpinteria',
    true
),
(
    'Barnissat',
    'Vernissat de fusta i superfícies. Protecció i embelliment de elements de fusta.',
    ARRAY['Vernís de portes', 'Barnissat de mobles', 'Tractament de bigues', 'Acabats naturals'],
    4,
    'barnissat',
    true
)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    display_order = EXCLUDED.display_order,
    slug = EXCLUDED.slug;

-- =====================================================
-- 8) Insert sample portfolio items (if empty)
-- =====================================================
INSERT INTO portfolio_items (title, description, image_url, before_image_url, after_image_url, category, visible, display_order) 
SELECT * FROM (VALUES
    ('Pintura interior habitatge Ciutadella', 'Pintura completa de parets i sostres en habitatge de 90m².', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', 'Pintura Interior', true, 1),
    ('Pintura exterior xalet Maó', 'Pintura de façana amb productes impermeabilitzants.', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', 'Pintura Exterior', true, 2),
    ('Pintura apartament turístic', 'Pintura interior amb acabats moderns en colors neutres.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'Pintura Interior', true, 3),
    ('Barnissat portes fusta', 'Vernissat de portes i marcs de fusta en habitatge.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', 'Barnissat', true, 4),
    ('Façana edifici Es Castell', 'Pintura i reparació de façana en edifici de 3 plantes.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'Pintura Exterior', true, 5),
    ('Reparació fusteria finestres', 'Arreglo i pintura de finestres de fusta antigues.', 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80', 'Carpinteria', true, 6)
) AS v(title, description, image_url, before_image_url, after_image_url, category, visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM portfolio_items LIMIT 1);

-- =====================================================
-- 9) Insert sample materials (if empty)
-- =====================================================
INSERT INTO materials (name, description, category, brand, unit, price, stock_quantity, image_url, is_available, is_visible, display_order)
SELECT * FROM (VALUES
    ('Pintura Plàstica Blanca', 'Pintura plàstica mate per a interiors. Alta cobertura.', 'Pintures', 'Titan', 'litre', 4.50, 150, 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80', true, true, 1),
    ('Pintura Exterior Façanes', 'Pintura acrílica per a exteriors. Resistència UV.', 'Pintures', 'Valentine', 'litre', 8.90, 80, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80', true, true, 2),
    ('Esmalte Sintètic Brillant', 'Esmalte per a fusta i metall. Secat ràpid.', 'Pintures', 'Titanlux', 'litre', 12.50, 45, 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80', true, true, 3),
    ('Vernís per a Fusta', 'Vernís transparent per a fusta interior.', 'Vernissos', 'Xylazel', 'litre', 11.90, 40, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', true, true, 4),
    ('Imprimació Universal', 'Imprimació adherent per a tot tipus de superfícies.', 'Imprimacions', 'Titan', 'litre', 9.90, 35, 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80', true, true, 5),
    ('Rodet de Pintura 22cm', 'Rodet professional per a pintura plàstica.', 'Eines', 'Rollex', 'unitat', 6.50, 50, 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80', true, true, 6),
    ('Brotxa Professional 100mm', 'Brotxa de cerdes naturals per a esmalts.', 'Eines', 'Leganés', 'unitat', 8.90, 30, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', true, true, 7),
    ('Cinta de Pintor', 'Cinta de carrosser 48mm x 50m. Fàcil retirada.', 'Materials', 'Tesa', 'unitat', 4.50, 100, 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80', true, true, 8)
) AS v(name, description, category, brand, unit, price, stock_quantity, image_url, is_available, is_visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM materials LIMIT 1);

-- =====================================================
-- 10) Flexible column additions for service_requests
-- =====================================================
-- Add name/email columns if using old schema
DO $$
BEGIN
    -- Check if we need to rename columns
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'client_name') THEN
        -- Old schema exists, add compatibility columns
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS name VARCHAR(150);
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS email VARCHAR(150);
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS service_type VARCHAR(100);
        
        -- Copy data from old columns
        UPDATE service_requests SET 
            name = client_name,
            email = client_email,
            phone = client_phone
        WHERE name IS NULL;
    ELSE
        -- New schema, add the columns we need
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS name VARCHAR(150);
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS email VARCHAR(150);
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
        ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS service_type VARCHAR(100);
    END IF;
END $$;

-- =====================================================
-- 11) Function to process email queue
-- =====================================================
CREATE OR REPLACE FUNCTION mark_email_sent(p_email_id UUID, p_message_id VARCHAR(255))
RETURNS VOID AS $$
BEGIN
    UPDATE email_queue 
    SET status = 'sent', sent_at = NOW()
    WHERE id = p_email_id;
    
    -- Also update the contact message if linked
    UPDATE contact_messages_v2 
    SET email_sent = true, email_sent_at = NOW(), email_message_id = p_message_id
    WHERE thread_id = (SELECT thread_id FROM email_queue WHERE id = p_email_id)
    AND email_sent = false;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 12) Function to add reply to thread
-- =====================================================
CREATE OR REPLACE FUNCTION add_thread_reply(
    p_thread_id UUID,
    p_sender_type VARCHAR(20),
    p_sender_email VARCHAR(150),
    p_message TEXT
) RETURNS UUID AS $$
DECLARE
    v_message_id UUID;
BEGIN
    INSERT INTO contact_messages_v2 (thread_id, sender_type, sender_email, message)
    VALUES (p_thread_id, p_sender_type, p_sender_email, p_message)
    RETURNING id INTO v_message_id;
    
    -- Update thread status
    UPDATE contact_threads 
    SET status = CASE WHEN p_sender_type = 'business' THEN 'replied' ELSE 'open' END,
        updated_at = NOW()
    WHERE id = p_thread_id;
    
    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql;
