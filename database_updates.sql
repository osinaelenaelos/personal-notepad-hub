
-- Создание таблицы уведомлений
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка демонстрационных уведомлений
INSERT INTO notifications (title, message, type, is_read) VALUES
('Система запущена', 'Административная панель успешно запущена и готова к работе', 'success', FALSE),
('Новый пользователь', 'Зарегистрирован новый пользователь в системе', 'info', FALSE),
('Превышен лимит места', 'Использование дискового пространства превышает 80%', 'warning', FALSE);

-- Обновление таблицы system_settings для хранения настроек email
ALTER TABLE system_settings 
ADD COLUMN IF NOT EXISTS description TEXT AFTER setting_value;

-- Вставка настроек по умолчанию для ролей пользователей
INSERT IGNORE INTO system_settings (setting_key, setting_value, description) VALUES
('user_page_limit', '10', 'Максимальное количество страниц для обычного пользователя'),
('premium_page_limit', '100', 'Максимальное количество страниц для премиум пользователя'),
('guest_page_limit', '3', 'Максимальное количество страниц для гостя'),
('max_file_size', '5242880', 'Максимальный размер файла в байтах (5MB)'),
('max_page_content_length', '100000', 'Максимальная длина содержимого страницы');
