<?php
/**
 * CALI VERDE - Configuración de Base de Datos
 * Conexión PDO con SQLite (para desarrollo rápido)
 */

// Configuración de la base de datos SQLite
define('DB_PATH', __DIR__ . '/../db/cali_verde.db');

// Configuración de CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Obtener conexión PDO con SQLite
 */
function getDBConnection() {
    try {
        $dsn = "sqlite:" . DB_PATH;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, null, null, $options);
        
        // Crear tabla si no existe
        if (!file_exists(DB_PATH)) {
            initDatabase($pdo);
        }
        
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed',
            'details' => $e->getMessage()
        ]);
        exit();
    }
}

/**
 * Inicializar base de datos con schema
 */
function initDatabase($pdo) {
    $schema = file_get_contents(__DIR__ . '/../db/schema_sqlite.sql');
    $pdo->exec($schema);
}

/**
 * Enviar respuesta JSON
 */
function sendJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Enviar error JSON
 */
function sendError($message, $details = null, $statusCode = 400) {
    $response = ['error' => $message];
    if ($details !== null) {
        $response['details'] = $details;
    }
    sendJSON($response, $statusCode);
}

/**
 * Validar coordenadas
 */
function validateCoordinates($lat, $lng) {
    // Cali está aprox entre 3.3° - 3.6° N y -76.6° - -76.4° W
    if ($lat < 3.0 || $lat > 4.0) {
        return false;
    }
    if ($lng < -77.0 || $lng > -76.0) {
        return false;
    }
    return true;
}

/**
 * Sanitizar entrada
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}
