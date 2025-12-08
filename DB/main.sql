-- Enable extension for UUIDs (recommended for modern apps)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Users (for admin panel access)
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)        NOT NULL,
    email           VARCHAR(150)        NOT NULL UNIQUE,
    password_hash   TEXT                NOT NULL,
    role            VARCHAR(50)         NOT NULL DEFAULT 'staff', -- e.g. 'admin', 'staff'
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- 2) Clients
CREATE TABLE clients (
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

-- Index
CREATE INDEX idx_clients_name ON clients (name);
CREATE INDEX idx_clients_email ON clients (email);

-- 3) Services (types of jobs offered)
CREATE TABLE services (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)        NOT NULL UNIQUE,
    description     TEXT,
    base_price      NUMERIC(10,2),
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- 4) Projects (jobs) linked to clients
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID                NOT NULL,
    title           VARCHAR(150)        NOT NULL,
    description     TEXT,
    status          VARCHAR(30)         NOT NULL DEFAULT 'pending',
    start_date      DATE,
    end_date        DATE,
    total_estimated NUMERIC(10,2),
    total_real      NUMERIC(10,2),
    created_by      UUID,  -- user who created the project
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_projects_client
        FOREIGN KEY (client_id) REFERENCES clients(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_project_status
        CHECK (status IN ('pending','in_progress','done','cancelled'))
);

CREATE INDEX idx_projects_client ON projects (client_id);
CREATE INDEX idx_projects_status ON projects (status);

-- 5) Junction: which services a project includes (for analytics)
CREATE TABLE project_services (
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
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID                NOT NULL,
    project_id      UUID,
    number          VARCHAR(50)         NOT NULL UNIQUE, -- e.g. 2025-001
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

CREATE INDEX idx_invoices_client ON invoices (client_id);
CREATE INDEX idx_invoices_project ON invoices (project_id);
CREATE INDEX idx_invoices_status ON invoices (status);
CREATE INDEX idx_invoices_issue_date ON invoices (issue_date);

-- 7) Invoice line items (linked to invoices, optionally to services)
CREATE TABLE invoice_items (
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
        CHECK (quantity > 0),
    CONSTRAINT chk_positive_prices
        CHECK (unit_price >= 0 AND line_total >= 0)
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items (invoice_id);

-- 8) Contact messages from public site
CREATE TABLE contact_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)        NOT NULL,
    email           VARCHAR(150),
    phone           VARCHAR(50),
    message         TEXT                NOT NULL,
    source          VARCHAR(50),        -- e.g. 'web_form', 'whatsapp', etc.
    handled         BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    handled_at      TIMESTAMPTZ,
    handled_by      UUID,
    CONSTRAINT fk_contact_handled_by
        FOREIGN KEY (handled_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_contact_handled ON contact_messages (handled);

-- 9) Portfolio items (linked to projects)
CREATE TABLE portfolio_items (
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

CREATE INDEX idx_portfolio_visible ON portfolio_items (visible);
CREATE INDEX idx_portfolio_project ON portfolio_items (project_id);

-- 10) Service Requests (Contact Form Submissions)
CREATE TABLE service_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name     VARCHAR(150)        NOT NULL,
    client_email    VARCHAR(150)        NOT NULL,
    client_phone    VARCHAR(50),
    service_type_id UUID,
    message         TEXT                NOT NULL,
    status          VARCHAR(50)         NOT NULL DEFAULT 'pending', -- pending, reviewed, contacted, converted
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_request_service
        FOREIGN KEY (service_type_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_service_requests_status ON service_requests (status);
CREATE INDEX idx_service_requests_email ON service_requests (client_email);