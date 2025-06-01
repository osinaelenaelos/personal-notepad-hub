
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

    $db = Database::getInstance()->getConnection();

    // Получаем статистику
    $stats = [];

    // Общее количество пользователей
    $stmt = $db->query("SELECT COUNT(*) FROM users");
    $stats['total_users'] = $stmt->fetchColumn();

    // Общее количество страниц
    $stmt = $db->query("SELECT COUNT(*) FROM pages");
    $stats['total_pages'] = $stmt->fetchColumn();

    // Активные пользователи (активность за последние 30 дней)
    $stmt = $db->query("SELECT COUNT(*) FROM users WHERE last_active >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    $stats['active_users'] = $stmt->fetchColumn();

    // Публичные страницы
    $stmt = $db->query("SELECT COUNT(*) FROM pages WHERE is_public = 1");
    $stats['public_pages'] = $stmt->fetchColumn();

    // Последние пользователи
    $stmt = $db->prepare("
        SELECT id, email, role, status, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $stmt->execute();
    $stats['recent_users'] = $stmt->fetchAll();

    // График пользователей за последние 7 дней
    $stmt = $db->query("
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as users
        FROM users 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
    ");
    $stats['users_chart'] = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $stats
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
