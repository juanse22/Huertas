-- ============================================
-- CALI VERDE - Schema Database
-- Tabla de huertas comunitarias
-- ============================================

CREATE DATABASE IF NOT EXISTS cali_verde CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cali_verde;

DROP TABLE IF EXISTS huertas;

CREATE TABLE huertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    responsable VARCHAR(120),
    barrio VARCHAR(120),
    direccion VARCHAR(180),
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    tipo ENUM('comunitaria', 'escolar', 'familiar') DEFAULT 'comunitaria',
    practicas JSON,
    contacto_tel VARCHAR(30),
    contacto_email VARCHAR(120),
    fotos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para búsquedas
    INDEX idx_barrio (barrio),
    INDEX idx_tipo (tipo),
    INDEX idx_coords (lat, lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
