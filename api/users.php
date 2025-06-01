
<?php
require_once 'config/config.php';
require_once 'config/database.php';
require_once 'includes/auth.php';

header('Content-Type: application/json');

try {
    // Проверка авторизации
    $user = getAuthUser();
    if (!$user || $user['role'] !== 'admin') {
        throw new Exception('Доступ запрещен');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? $_GET['action'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];

    $db = Database::getInstance()->getConnection();

    switch ($action) {
        case 'create':
            if ($method !== 'POST') {
                throw new Exception('Метод не поддерживается');
            }

            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $role = $input['role'] ?? 'user';

            if (empty($email) || empty($password)) {
                throw new Exception('Email и пароль обязательны');
            }

            // Проверяем уникальность email
            $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Пользователь с таким email уже существует');
            }

            $passwordHash = password_hash($password . PASSWORD_SALT, PASSWORD_DEFAULT);

            $stmt = $db->prepare("INSERT INTO users (email, password_hash, role, status, created_at) VALUES (?, ?, ?, 'active', NOW())");
            $stmt->execute([$email, $passwordHash, $role]);

            $userId = $db->lastInsertId();

            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $userId,
                    'email' => $email,
                    'role' => $role,
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s'),
                    'pages_count' => 0
                ],
                'message' => 'Пользователь создан успешно'
            ]);
            break;

        default:
            // Получение списка пользователей
            $stmt = $db->prepare("
                SELECT 
                    u.id, 
                    u.email, 
                    u.role, 
                    u.status, 
                    u.created_at, 
                    u.last_active,
                    COUNT(p.id) as pages_count
                FROM users u
                LEFT JOIN pages p ON u.id = p.user_id
                GROUP BY u.id
                ORDER BY u.created_at DESC
            ");
            $stmt->execute();
            $users = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $users ?: []
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
