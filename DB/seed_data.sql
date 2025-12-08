-- Seed Data Script for Miquel A. Riudavets Mercadal Website
-- Run this after main.sql and update_schema_v2.sql
-- This populates the database with sample services, portfolio items, and materials

-- =====================================================
-- 1) SERVICES (Serveis)
-- =====================================================
INSERT INTO services (id, name, description, features, base_price, is_active, display_order, slug, icon)
VALUES
  (
    uuid_generate_v4(),
    'Pintura Interior',
    'Pintura de parets, sostres i espais interiors. Preparació de superfícies, empastats i acabats professionals.',
    ARRAY['Preparació de superfícies', 'Pintura de parets i sostres', 'Pintura de portes i fusteries', 'Acabats especials'],
    NULL,
    TRUE,
    1,
    'pintura-interior',
    'paint-roller'
  ),
  (
    uuid_generate_v4(),
    'Pintura Exterior',
    'Pintura de façanes i exteriors amb productes resistents a les condicions climàtiques de Menorca.',
    ARRAY['Pintura de façanes', 'Tractaments antihumitat', 'Reparació de fissures', 'Neteja de superfícies'],
    NULL,
    TRUE,
    2,
    'pintura-exterior',
    'home'
  ),
  (
    uuid_generate_v4(),
    'Carpinteria',
    'Arreglos de fusteria en general. Portes, finestres, mobles i altres elements de fusta.',
    ARRAY['Reparació de portes', 'Arreglo de finestres', 'Restauració de mobles', 'Treballs a mida'],
    NULL,
    TRUE,
    3,
    'carpinteria',
    'hammer'
  ),
  (
    uuid_generate_v4(),
    'Barnissat',
    'Vernissat de fusta i superfícies. Protecció i embelliment de elements de fusta.',
    ARRAY['Vernís de portes', 'Barnissat de mobles', 'Tractament de bigues', 'Acabats naturals'],
    NULL,
    TRUE,
    4,
    'barnissat',
    'brush'
  )
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  display_order = EXCLUDED.display_order,
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon;

-- =====================================================
-- 2) PORTFOLIO ITEMS (Treballs)
-- =====================================================
INSERT INTO portfolio_items (id, title, description, image_url, before_image_url, after_image_url, category, visible, display_order)
VALUES
  (
    uuid_generate_v4(),
    'Pintura interior habitatge Ciutadella',
    'Pintura completa de parets i sostres en habitatge de 90m².',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    'Pintura Interior',
    TRUE,
    1
  ),
  (
    uuid_generate_v4(),
    'Pintura exterior xalet Maó',
    'Pintura de façana amb productes impermeabilitzants.',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'Pintura Exterior',
    TRUE,
    2
  ),
  (
    uuid_generate_v4(),
    'Pintura apartament turístic',
    'Pintura interior amb acabats moderns en colors neutres.',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'Pintura Interior',
    TRUE,
    3
  ),
  (
    uuid_generate_v4(),
    'Barnissat portes fusta',
    'Vernissat de portes i marcs de fusta en habitatge.',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'Barnissat',
    TRUE,
    4
  ),
  (
    uuid_generate_v4(),
    'Façana edifici Es Castell',
    'Pintura i reparació de façana en edifici de 3 plantes.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'Pintura Exterior',
    TRUE,
    5
  ),
  (
    uuid_generate_v4(),
    'Reparació fusteria finestres',
    'Arreglo i pintura de finestres de fusta antigues.',
    'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80',
    'Carpinteria',
    TRUE,
    6
  ),
  (
    uuid_generate_v4(),
    'Pintura local comercial',
    'Pintura interior de local comercial a Maó.',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    'Pintura Interior',
    TRUE,
    7
  ),
  (
    uuid_generate_v4(),
    'Barnissat bigues de fusta',
    'Tractament i vernissat de bigues de fusta vistes.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'Barnissat',
    TRUE,
    8
  ),
  (
    uuid_generate_v4(),
    'Restauració porta antiga',
    'Restauració i pintura de porta d''entrada de fusta massissa.',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    'Carpinteria',
    TRUE,
    9
  ),
  (
    uuid_generate_v4(),
    'Pintura exterior casa de camp',
    'Pintura completa de façanes i persianes.',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    'Pintura Exterior',
    TRUE,
    10
  ),
  (
    uuid_generate_v4(),
    'Pintura habitació infantil',
    'Pintura amb colors vius i acabats especials.',
    'https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=800&q=80',
    'Pintura Interior',
    TRUE,
    11
  ),
  (
    uuid_generate_v4(),
    'Barnissat mobles cuina',
    'Vernissat de portes d''armaris de cuina.',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
    'Barnissat',
    TRUE,
    12
  );

-- =====================================================
-- 3) MATERIALS
-- =====================================================

-- Material Categories (optional reference table)
CREATE TABLE IF NOT EXISTS material_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)        NOT NULL UNIQUE,
    description     TEXT,
    display_order   INT                 NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

INSERT INTO material_categories (name, description, display_order)
VALUES
  ('Pintures', 'Pintures plàstiques, acríliques i esmalts', 1),
  ('Imprimacions', 'Imprimacions i preparadors de superfícies', 2),
  ('Vernissos', 'Vernissos per a fusta i altres superfícies', 3),
  ('Materials', 'Materials auxiliars per a pintura', 4),
  ('Eines', 'Eines i accessoris de pintura', 5)
ON CONFLICT (name) DO NOTHING;

-- Materials data
INSERT INTO materials (id, name, description, category, brand, unit, price, stock_quantity, image_url, is_available, is_visible, display_order)
VALUES
  -- Pintures
  (
    uuid_generate_v4(),
    'Pintura Plàstica Blanca',
    'Pintura plàstica mate per a interiors. Alta cobertura.',
    'Pintures',
    'Titan',
    'litre',
    4.50,
    150,
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    1
  ),
  (
    uuid_generate_v4(),
    'Pintura Exterior Façanes',
    'Pintura acrílica per a exteriors. Resistència UV.',
    'Pintures',
    'Valentine',
    'litre',
    8.90,
    80,
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    2
  ),
  (
    uuid_generate_v4(),
    'Esmalte Sintètic Brillant',
    'Esmalte per a fusta i metall. Secat ràpid.',
    'Pintures',
    'Titanlux',
    'litre',
    12.50,
    45,
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    3
  ),
  (
    uuid_generate_v4(),
    'Pintura Antihumitat',
    'Pintura especial per a zones amb humitat.',
    'Pintures',
    'Titan',
    'litre',
    15.90,
    30,
    'https://images.unsplash.com/photo-1560574188-6a6774965120?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    4
  ),
  (
    uuid_generate_v4(),
    'Pintura Plàstica Colors',
    'Pintura plàstica en diversos colors. Carta RAL.',
    'Pintures',
    'Bruguer',
    'litre',
    6.50,
    100,
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    5
  ),
  -- Imprimacions
  (
    uuid_generate_v4(),
    'Imprimació Universal',
    'Imprimació adherent per a tot tipus de superfícies.',
    'Imprimacions',
    'Titan',
    'litre',
    9.90,
    35,
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    6
  ),
  (
    uuid_generate_v4(),
    'Imprimació Galvanitzat',
    'Imprimació especial per a superfícies galvanitzades.',
    'Imprimacions',
    'Oxiron',
    'litre',
    14.50,
    20,
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    7
  ),
  -- Vernissos
  (
    uuid_generate_v4(),
    'Vernís per a Fusta',
    'Vernís transparent per a fusta interior.',
    'Vernissos',
    'Xylazel',
    'litre',
    11.90,
    40,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    8
  ),
  (
    uuid_generate_v4(),
    'Vernís Marítim',
    'Vernís especial per a exteriors i ambients humits.',
    'Vernissos',
    'Titan Yate',
    'litre',
    18.90,
    25,
    'https://images.unsplash.com/photo-1541123603104-512919d6a96c?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    9
  ),
  -- Materials
  (
    uuid_generate_v4(),
    'Massilla Plàstica',
    'Massilla per a reparació de parets i sostres.',
    'Materials',
    'Aguaplast',
    'kg',
    3.20,
    200,
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    10
  ),
  (
    uuid_generate_v4(),
    'Cinta de Pintor',
    'Cinta de carrosser 48mm x 50m. Fàcil retirada.',
    'Materials',
    'Tesa',
    'unitat',
    4.50,
    100,
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    11
  ),
  (
    uuid_generate_v4(),
    'Paper de Vidre',
    'Paper de vidre gra mig. Pack de 10 fulles.',
    'Materials',
    'Norton',
    'pack',
    5.90,
    60,
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    12
  ),
  -- Eines
  (
    uuid_generate_v4(),
    'Rodet de Pintura 22cm',
    'Rodet professional per a pintura plàstica.',
    'Eines',
    'Rollex',
    'unitat',
    6.50,
    50,
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    13
  ),
  (
    uuid_generate_v4(),
    'Brotxa Professional 100mm',
    'Brotxa de cerdes naturals per a esmalts.',
    'Eines',
    'Leganés',
    'unitat',
    8.90,
    30,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    14
  ),
  (
    uuid_generate_v4(),
    'Safata de Pintura',
    'Safata de plàstic per a rodet de 22cm.',
    'Eines',
    'Generic',
    'unitat',
    2.50,
    80,
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    15
  ),
  (
    uuid_generate_v4(),
    'Espàtula Professional',
    'Espàtula d''acer inoxidable 10cm.',
    'Eines',
    'Bellota',
    'unitat',
    4.90,
    40,
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    16
  ),
  (
    uuid_generate_v4(),
    'Dissolvent Universal',
    'Dissolvent per a neteja i dilució.',
    'Materials',
    'Titan',
    'litre',
    7.50,
    70,
    'https://images.unsplash.com/photo-1560574188-6a6774965120?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    17
  ),
  (
    uuid_generate_v4(),
    'Malla de Fibra',
    'Malla per a reparació de fissures. Rotllo 50m.',
    'Materials',
    'Beissier',
    'unitat',
    12.90,
    25,
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    TRUE,
    TRUE,
    18
  );

-- =====================================================
-- DONE! Summary of inserted data:
-- - 4 Services (Pintura Interior, Pintura Exterior, Carpinteria, Barnissat)
-- - 12 Portfolio Items (various painting and carpentry projects)
-- - 18 Materials (paints, primers, varnishes, tools)
-- - 5 Material Categories
-- =====================================================

SELECT 'Seed data inserted successfully!' AS status;
SELECT 'Services: ' || COUNT(*) FROM services;
SELECT 'Portfolio Items: ' || COUNT(*) FROM portfolio_items;
SELECT 'Materials: ' || COUNT(*) FROM materials;
