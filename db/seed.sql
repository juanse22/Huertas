-- ============================================
-- CALI VERDE - Datos de ejemplo (SEED)
-- 8 huertas en barrios de Cali con coordenadas reales
-- ============================================

USE cali_verde;

-- Limpiar datos previos
DELETE FROM huertas;

-- Insertar huertas de ejemplo
INSERT INTO huertas (nombre, responsable, barrio, direccion, lat, lng, tipo, practicas, contacto_tel, contacto_email, fotos) VALUES
(
    'Huerta Comunitaria San Antonio',
    'María López González',
    'San Antonio',
    'Calle 1 Oeste #3-45',
    3.448889,
    -76.531944,
    'comunitaria',
    '["agroecológica", "compostaje", "riego por goteo"]',
    '3201234567',
    'huerta.sanantonio@gmail.com',
    '["uploads/san_antonio_1.jpg"]'
),
(
    'Huerta Escolar Niños de San Nicolás',
    'Pedro Ramírez Soto',
    'San Nicolás',
    'Carrera 4 #2-34',
    3.452222,
    -76.533889,
    'escolar',
    '["agroecológica", "captación de lluvia"]',
    '3157654321',
    'escuela.sannicolas@edu.co',
    '["uploads/san_nicolas_1.jpg", "uploads/san_nicolas_2.jpg"]'
),
(
    'Siloé Verde - Huerta Loma de la Cruz',
    'Ana Lucía Martínez',
    'Siloé',
    'Calle 5B #34-12, Loma de la Cruz',
    3.411111,
    -76.555556,
    'comunitaria',
    '["agroecológica", "compostaje", "captación de lluvia"]',
    '3209876543',
    'siloe.verde@hotmail.com',
    '["uploads/siloe_1.jpg"]'
),
(
    'Huerta Familiar Los Girasoles',
    'Carlos Hernández',
    'Aguablanca',
    'Calle 52 #3H-21',
    3.417778,
    -76.486111,
    'familiar',
    '["agroecológica", "riego por goteo"]',
    '3186547890',
    'carlos.huertas@outlook.com',
    NULL
),
(
    'Jardín Comunitario El Ingenio',
    'Luz Dary Ospina',
    'El Ingenio',
    'Carrera 100 #18-45',
    3.368333,
    -76.513333,
    'comunitaria',
    '["agroecológica", "compostaje", "riego por goteo", "captación de lluvia"]',
    '3204561234',
    'ingenio.verde@gmail.com',
    '["uploads/ingenio_1.jpg", "uploads/ingenio_2.jpg"]'
),
(
    'Huerta La Flora - Semillas de Esperanza',
    'Jorge Alberto Muñoz',
    'La Flora',
    'Calle 70 #8C-12',
    3.402222,
    -76.521111,
    'comunitaria',
    '["agroecológica", "compostaje"]',
    '3178889999',
    'laflora.huerta@yahoo.com',
    '["uploads/la_flora_1.jpg"]'
),
(
    'Huerta Escolar Terrón Colorado',
    'Sandra Milena Gómez',
    'Terrón Colorado',
    'Carrera 1J #70-23',
    3.393889,
    -76.505000,
    'escolar',
    '["agroecológica", "riego por goteo"]',
    '3165554321',
    'terron.escuela@edu.co',
    NULL
),
(
    'Huerta Comunitaria Alfonso López',
    'Roberto García Díaz',
    'Alfonso López',
    'Calle 33 #2E-56',
    3.410000,
    -76.497778,
    'comunitaria',
    '["agroecológica", "compostaje", "captación de lluvia"]',
    '3192223344',
    'alfonso.huerta@comunidad.org',
    '["uploads/alfonso_1.jpg", "uploads/alfonso_2.jpg", "uploads/alfonso_3.jpg"]'
),
(
    'Huerta Familiar Meléndez Verde',
    'Diana Patricia Rojas',
    'Meléndez',
    'Carrera 98 #16-34',
    3.365000,
    -76.528889,
    'familiar',
    '["agroecológica", "riego por goteo"]',
    '3173334455',
    'melendez.verde@gmail.com',
    NULL
),
(
    'Huerta Valle del Lili - Raíces Urbanas',
    'Miguel Ángel Torres',
    'Valle del Lili',
    'Calle 16 #100-23',
    3.356667,
    -76.518889,
    'comunitaria',
    '["agroecológica", "compostaje", "riego por goteo"]',
    '3208887766',
    'vallelili.raices@hotmail.com',
    '["uploads/valle_lili_1.jpg"]'
);

-- Verificar datos insertados
SELECT COUNT(*) as total_huertas FROM huertas;
SELECT barrio, COUNT(*) as cantidad FROM huertas GROUP BY barrio;
