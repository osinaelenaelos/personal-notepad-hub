
<?php
require_once 'config/config.php';
require_once 'config/database.php';

header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? $_GET['action'] ?? '';

    $db = Database::getInstance()->getConnection();

    switch ($action) {
        case 'create_admin':
            // Создаем таблицы если их нет
            createTables($db);
            
            // Проверяем есть ли уже админ - ИСПРАВЛЕННЫЙ ЗАПРОС
            $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin'");
            $stmt->execute();
            $adminCount = $stmt->fetchColumn();

            if ($adminCount > 0) {
                throw new Exception('Администратор уже существует');
            }

            $email = 'admin@texttabs.com';
            $password = 'admin123';
            $passwordHash = password_hash($password . PASSWORD_SALT, PASSWORD_DEFAULT);

            $stmt = $db->prepare("INSERT INTO users (email, password_hash, role, status, created_at) VALUES (?, ?, 'admin', 'active', NOW())");
            $stmt->execute([$email, $passwordHash]);

            echo json_encode([
                'success' => true,
                'login' => $email,
                'password' => $password,
                'message' => 'Администратор создан успешно'
            ]);
            break;

        case 'test_connection':
            // Простая проверка подключения
            $stmt = $db->query("SELECT 1");
            $result = $stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'message' => 'Подключение к базе данных успешно'
            ]);
            break;

        case 'create_tables':
            createTables($db);
            echo json_encode([
                'success' => true,
                'message' => 'Таблицы созданы успешно'
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

function createTables($db) {
    // Создание таблицы пользователей с исправленными именами колонок
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('guest', 'user', 'premium', 'admin') DEFAULT 'user',
            status ENUM('active', 'blocked', 'pending') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Создание таблицы страниц
    $db->exec("
        CREATE TABLE IF NOT EXISTS pages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            content LONGTEXT,
            slug VARCHAR(255) NOT NULL,
            is_public BOOLEAN DEFAULT FALSE,
            views_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Создание таблицы настроек
    $db->exec("
        CREATE TABLE IF NOT EXISTS system_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(255) NOT NULL UNIQUE,
            setting_value TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Создание таблицы уведомлений
    $db->exec("
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Вставка базовых настроек
    $db->exec("
        INSERT IGNORE INTO system_settings (setting_key, setting_value, description) VALUES
        ('smtp_host', 'smtp.gmail.com', 'SMTP сервер для отправки почты'),
        ('smtp_port', '587', 'Порт SMTP сервера'),
        ('smtp_username', '', 'Имя пользователя SMTP'),
        ('smtp_password', '', 'Пароль SMTP'),
        ('smtp_encryption', 'tls', 'Тип шифрования SMTP'),
        ('site_url', 'http://localhost', 'URL сайта'),
        ('admin_email', 'admin@texttabs.com', 'Email администратора'),
        ('user_page_limit', '10', 'Лимит страниц для обычных пользователей'),
        ('premium_page_limit', '100', 'Лимит страниц для премиум пользователей'),
        ('guest_page_limit', '3', 'Лимит страниц для гостей')
    ");
}
?>
