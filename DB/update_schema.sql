-- Enable extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Users
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)        NOT NULL,
    email           VARCHAR(150)        NOT NULL UNIQUE,
    password_hash   TEXT                NOT NULL,
    role            VARCHAR(50)         NOT NULL DEFAULT 'staff',
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- 2) Clients
CREATE TABLE IF NOT EXISTS clients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    email           VARCHAR(150),
    phone           VARCHAR(50),
    address_line1   VARCHAR(255),
    address_line2   VARCHAR(255),
    city            VARCHAR(100),
    postal_code     VARCHAR(20),
    notes           TEXT,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_name ON clients (name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);

-- 3) Services
CREATE TABLE IF NOT EXISTS services (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)        NOT NULL UNIQUE,
    description     TEXT,
    base_price      NUMERIC(10,2),
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- 4) Projects
CREATE TABLE IF NOT EXISTS projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID                NOT NULL,
    title           VARCHAR(150)        NOT NULL,
    description     TEXT,
    status          VARCHAR(30)         NOT NULL DEFAULT 'pending',
    start_date      DATE,
    end_date        DATE,
    total_estimated NUMERIC(10,2),
    total_real      NUMERIC(10,2),
    created_by      UUID,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_projects_client
        FOREIGN KEY (client_id) REFERENCES clients(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_project_status
        CHECK (status IN ('pending','in_progress','done','cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_projects_client ON projects (client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);

-- Fix constraint for projects if it exists
ALTER TABLE projects DROP CONSTRAINT IF EXISTS fk_projects_created_by;
ALTER TABLE projects ADD CONSTRAINT fk_projects_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- 5) Project Services
CREATE TABLE IF NOT EXISTS project_services (
    project_id      UUID NOT NULL,
    service_id      UUID NOT NULL,
    quantity        NUMERIC(10,2),
    unit_price      NUMERIC(10,2),
    PRIMARY KEY (project_id, service_id),
    CONSTRAINT fk_ps_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ps_service
        FOREIGN KEY (service_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 6) Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID                NOT NULL,
    project_id      UUID,
    number          VARCHAR(50)         NOT NULL UNIQUE,
    issue_date      DATE                NOT NULL DEFAULT CURRENT_DATE,
    due_date        DATE,
    status          VARCHAR(20)         NOT NULL DEFAULT 'draft',
    subtotal        NUMERIC(12,2)       NOT NULL DEFAULT 0,
    tax_amount      NUMERIC(12,2)       NOT NULL DEFAULT 0,
    total           NUMERIC(12,2)       NOT NULL DEFAULT 0,
    notes           TEXT,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_invoices_client
        FOREIGN KEY (client_id) REFERENCES clients(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_invoices_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_invoice_status
        CHECK (status IN ('draft','sent','paid','overdue','cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices (client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON invoices (project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);

-- Fix constraint for invoices
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS fk_invoices_project;
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_project 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- 7) Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id      UUID                NOT NULL,
    service_id      UUID,
    description     VARCHAR(255)        NOT NULL,
    quantity        NUMERIC(10,2)       NOT NULL DEFAULT 1,
    unit_price      NUMERIC(12,2)       NOT NULL DEFAULT 0,
    line_total      NUMERIC(12,2)       NOT NULL,
    CONSTRAINT fk_items_invoice
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_items_service
        FOREIGN KEY (service_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_positive_qty
        CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items (invoice_id);

-- Fix constraint for invoice_items
ALTER TABLE invoice_items DROP CONSTRAINT IF EXISTS fk_items_service;
ALTER TABLE invoice_items ADD CONSTRAINT fk_items_service 
    FOREIGN KEY (service_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- 8) Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    email           VARCHAR(150),
    phone           VARCHAR(50),
    message         TEXT                NOT NULL,
    source          VARCHAR(50),
    handled         BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    handled_at      TIMESTAMPTZ,
    handled_by      UUID,
    CONSTRAINT fk_contact_handled_by
        FOREIGN KEY (handled_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_handled ON contact_messages (handled);

-- Fix constraint for contact_messages
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS fk_contact_handled_by;
ALTER TABLE contact_messages ADD CONSTRAINT fk_contact_handled_by 
    FOREIGN KEY (handled_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- 9) Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id          UUID,
    title               VARCHAR(150)        NOT NULL,
    description         TEXT,
    image_url           TEXT,
    before_image_url    TEXT,
    after_image_url     TEXT,
    visible             BOOLEAN             NOT NULL DEFAULT TRUE,
    display_order       INT                 NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_portfolio_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_portfolio_visible ON portfolio_items (visible);
CREATE INDEX IF NOT EXISTS idx_portfolio_project ON portfolio_items (project_id);

-- Fix constraint for portfolio_items
ALTER TABLE portfolio_items DROP CONSTRAINT IF EXISTS fk_portfolio_project;
ALTER TABLE portfolio_items ADD CONSTRAINT fk_portfolio_project 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- 10) Service Requests (New Table)
CREATE TABLE IF NOT EXISTS service_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name     VARCHAR(150)        NOT NULL,
    client_email    VARCHAR(150)        NOT NULL,
    client_phone    VARCHAR(50),
    service_type_id UUID,
    message         TEXT                NOT NULL,
    status          VARCHAR(50)         NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_request_service
        FOREIGN KEY (service_type_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests (status);
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON service_requests (client_email);

-- Fix constraint for service_requests
ALTER TABLE service_requests DROP CONSTRAINT IF EXISTS fk_request_service;
ALTER TABLE service_requests ADD CONSTRAINT fk_request_service 
    FOREIGN KEY (service_type_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE SET NULL;
