
<?php
require_once 'config/config.php';
require_once 'config/database.php';
require_once 'includes/auth.php';

header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? $_GET['action'] ?? '';

    $db = Database::getInstance()->getConnection();

    switch ($action) {
        case 'login':
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            if (empty($email) || empty($password)) {
                throw new Exception('Email и пароль обязательны');
            }

            $stmt = $db->prepare("SELECT id, email, password_hash, role, status FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password . PASSWORD_SALT, $user['password_hash'])) {
                throw new Exception('Неверный email или пароль');
            }

            if ($user['status'] !== 'active') {
                throw new Exception('Аккаунт заблокирован');
            }

            // Обновляем время последней активности
            $stmt = $db->prepare("UPDATE users SET last_active = NOW() WHERE id = ?");
            $stmt->execute([$user['id']]);

            $token = generateJWT($user['id'], $user['email'], $user['role']);

            echo json_encode([
                'success' => true,
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'status' => $user['status']
                    ]
                ]
            ]);
            break;

        case 'verify_token':
            $user = getAuthUser();
            if (!$user) {
                throw new Exception('Недействительный токен');
            }

            echo json_encode([
                'success' => true,
                'data' => [
                    'user_id' => $user['user_id'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
            break;

        default:
            throw new Exception('Неизвестное действие');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
