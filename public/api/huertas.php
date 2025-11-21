<?php
/**
 * CALI VERDE - API REST para Huertas
 * Endpoints: GET, POST, PUT, DELETE
 */

require_once 'config.php';

// Obtener método HTTP y ruta
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];

// Extraer ID si existe (formato: /api/huertas.php/123 o /api/huertas.php?id=123)
$id = null;
if (preg_match('/\/huertas\.php\/(\d+)/', $path, $matches)) {
    $id = intval($matches[1]);
} elseif (isset($_GET['id'])) {
    $id = intval($_GET['id']);
}

// Router principal
switch ($method) {
    case 'GET':
        if ($id) {
            getHuerta($id);
        } else {
            getHuertas();
        }
        break;
    
    case 'POST':
        createHuerta();
        break;
    
    case 'PUT':
        if (!$id) {
            sendError('ID requerido para actualizar', null, 400);
        }
        updateHuerta($id);
        break;
    
    case 'DELETE':
        if (!$id) {
            sendError('ID requerido para eliminar', null, 400);
        }
        deleteHuerta($id);
        break;
    
    default:
        sendError('Método no permitido', null, 405);
}

/**
 * GET /huertas - Obtener todas las huertas
 * Soporta filtros: ?barrio=X&tipo=Y
 */
function getHuertas() {
    $pdo = getDBConnection();
    
    // Construir query con filtros opcionales
    $sql = "SELECT * FROM huertas WHERE 1=1";
    $params = [];
    
    if (isset($_GET['barrio']) && !empty($_GET['barrio'])) {
        $sql .= " AND barrio LIKE :barrio";
        $params[':barrio'] = '%' . sanitizeInput($_GET['barrio']) . '%';
    }
    
    if (isset($_GET['tipo']) && !empty($_GET['tipo'])) {
        $sql .= " AND tipo = :tipo";
        $params[':tipo'] = sanitizeInput($_GET['tipo']);
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $huertas = $stmt->fetchAll();
        
        // Decodificar JSON fields
        foreach ($huertas as &$huerta) {
            $huerta['practicas'] = json_decode($huerta['practicas'] ?? '[]');
            $huerta['fotos'] = json_decode($huerta['fotos'] ?? '[]');
        }
        
        sendJSON($huertas);
    } catch (PDOException $e) {
        sendError('Error al obtener huertas', $e->getMessage(), 500);
    }
}

/**
 * GET /huertas/:id - Obtener una huerta específica
 */
function getHuerta($id) {
    $pdo = getDBConnection();
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM huertas WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $huerta = $stmt->fetch();
        
        if (!$huerta) {
            sendError('Huerta no encontrada', null, 404);
        }
        
        // Decodificar JSON fields
        $huerta['practicas'] = json_decode($huerta['practicas'] ?? '[]');
        $huerta['fotos'] = json_decode($huerta['fotos'] ?? '[]');
        
        sendJSON($huerta);
    } catch (PDOException $e) {
        sendError('Error al obtener huerta', $e->getMessage(), 500);
    }
}

/**
 * POST /huertas - Crear nueva huerta
 */
function createHuerta() {
    // Leer datos JSON del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Datos JSON inválidos', null, 400);
    }
    
    // Validar campos requeridos
    $required = ['nombre', 'lat', 'lng'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            sendError("Campo requerido: $field", null, 400);
        }
    }
    
    // Validar coordenadas
    $lat = floatval($input['lat']);
    $lng = floatval($input['lng']);
    
    if (!validateCoordinates($lat, $lng)) {
        sendError('Coordenadas fuera del rango de Cali', 
                  'Lat debe estar entre 3.0-4.0, Lng entre -77.0 y -76.0', 400);
    }
    
    // Sanitizar y preparar datos
    $data = [
        ':nombre' => sanitizeInput($input['nombre']),
        ':responsable' => sanitizeInput($input['responsable'] ?? null),
        ':barrio' => sanitizeInput($input['barrio'] ?? null),
        ':direccion' => sanitizeInput($input['direccion'] ?? null),
        ':lat' => $lat,
        ':lng' => $lng,
        ':tipo' => sanitizeInput($input['tipo'] ?? 'comunitaria'),
        ':practicas' => json_encode($input['practicas'] ?? []),
        ':contacto_tel' => sanitizeInput($input['contacto_tel'] ?? null),
        ':contacto_email' => filter_var($input['contacto_email'] ?? '', FILTER_SANITIZE_EMAIL),
        ':fotos' => json_encode($input['fotos'] ?? [])
    ];
    
    // Validar tipo
    $validTypes = ['comunitaria', 'escolar', 'familiar'];
    if (!in_array($data[':tipo'], $validTypes)) {
        sendError('Tipo inválido', 'Debe ser: comunitaria, escolar o familiar', 400);
    }
    
    $pdo = getDBConnection();
    
    try {
        $sql = "INSERT INTO huertas 
                (nombre, responsable, barrio, direccion, lat, lng, tipo, practicas, contacto_tel, contacto_email, fotos)
                VALUES 
                (:nombre, :responsable, :barrio, :direccion, :lat, :lng, :tipo, :practicas, :contacto_tel, :contacto_email, :fotos)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($data);
        
        $newId = $pdo->lastInsertId();
        
        sendJSON([
            'message' => 'Huerta creada exitosamente',
            'id' => $newId
        ], 201);
    } catch (PDOException $e) {
        sendError('Error al crear huerta', $e->getMessage(), 500);
    }
}

/**
 * PUT /huertas/:id - Actualizar huerta existente
 */
function updateHuerta($id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Datos JSON inválidos', null, 400);
    }
    
    $pdo = getDBConnection();
    
    // Verificar que la huerta existe
    $stmt = $pdo->prepare("SELECT id FROM huertas WHERE id = :id");
    $stmt->execute([':id' => $id]);
    if (!$stmt->fetch()) {
        sendError('Huerta no encontrada', null, 404);
    }
    
    // Construir UPDATE dinámico solo con campos enviados
    $allowedFields = ['nombre', 'responsable', 'barrio', 'direccion', 'lat', 'lng', 
                      'tipo', 'practicas', 'contacto_tel', 'contacto_email', 'fotos'];
    $updates = [];
    $params = [':id' => $id];
    
    foreach ($input as $key => $value) {
        if (in_array($key, $allowedFields)) {
            if (in_array($key, ['practicas', 'fotos'])) {
                $params[":$key"] = json_encode($value);
            } elseif ($key === 'lat' || $key === 'lng') {
                $params[":$key"] = floatval($value);
            } else {
                $params[":$key"] = sanitizeInput($value);
            }
            $updates[] = "$key = :$key";
        }
    }
    
    if (empty($updates)) {
        sendError('No hay campos para actualizar', null, 400);
    }
    
    // Validar coordenadas si se actualizan
    if (isset($params[':lat']) && isset($params[':lng'])) {
        if (!validateCoordinates($params[':lat'], $params[':lng'])) {
            sendError('Coordenadas fuera del rango de Cali', null, 400);
        }
    }
    
    try {
        $sql = "UPDATE huertas SET " . implode(', ', $updates) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        sendJSON([
            'message' => 'Huerta actualizada exitosamente',
            'id' => $id
        ]);
    } catch (PDOException $e) {
        sendError('Error al actualizar huerta', $e->getMessage(), 500);
    }
}

/**
 * DELETE /huertas/:id - Eliminar huerta
 */
function deleteHuerta($id) {
    $pdo = getDBConnection();
    
    try {
        $stmt = $pdo->prepare("DELETE FROM huertas WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        if ($stmt->rowCount() === 0) {
            sendError('Huerta no encontrada', null, 404);
        }
        
        sendJSON([
            'message' => 'Huerta eliminada exitosamente',
            'id' => $id
        ]);
    } catch (PDOException $e) {
        sendError('Error al eliminar huerta', $e->getMessage(), 500);
    }
}
