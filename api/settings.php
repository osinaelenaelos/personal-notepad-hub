
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
        case 'test_db_connection':
            // Тест подключения к БД
            $config = $input['config'] ?? [];
            
            if (empty($config['host']) || empty($config['database']) || empty($config['username'])) {
                throw new Exception('Не все обязательные поля заполнены');
            }

            try {
                $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset=utf8mb4";
                $testDb = new PDO($dsn, $config['username'], $config['password'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ]);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Подключение к базе данных успешно!'
                ]);
            } catch (PDOException $e) {
                throw new Exception('Ошибка подключения: ' . $e->getMessage());
            }
            break;

        case 'create_tables':
            // Создание таблиц
            require_once 'project-settings.php';
            createTables($db);
            
            echo json_encode([
                'success' => true,
                'message' => 'Таблицы созданы успешно!'
            ]);
            break;

        case 'get_all':
            // Получение всех настроек
            $stmt = $db->query("SELECT setting_key, setting_value FROM system_settings");
            $settings = [];
            while ($row = $stmt->fetch()) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }

            echo json_encode([
                'success' => true,
                'data' => $settings
            ]);
            break;

        case 'update_settings':
            // Проверка авторизации для обновления
            $user = getAuthUser();
            if (!$user || $user['role'] !== 'admin') {
                throw new Exception('Доступ запрещен');
            }

            $settings = $input['settings'] ?? [];
            
            foreach ($settings as $key => $value) {
                $stmt = $db->prepare("
                    INSERT INTO system_settings (setting_key, setting_value) 
                    VALUES (?, ?) 
                    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
                ");
                $stmt->execute([$key, $value]);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Настройки обновлены!'
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
