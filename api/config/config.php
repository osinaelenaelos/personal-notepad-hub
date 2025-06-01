
<?php
// Основные настройки системы
define('DB_HOST', 'localhost');
define('DB_NAME', 'texttabs_admin');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// JWT настройки
define('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 3600 * 24); // 24 часа

// Настройки безопасности
define('PASSWORD_SALT', 'your-password-salt-change-this');

// CORS настройки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Автозагрузка
function autoload($className) {
    $file = __DIR__ . '/' . str_replace('\\', '/', $className) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
}
spl_autoload_register('autoload');
?>
