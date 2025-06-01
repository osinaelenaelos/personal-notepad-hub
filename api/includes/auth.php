
<?php
require_once __DIR__ . '/../config/config.php';

function generateJWT($userId, $email, $role) {
    $header = json_encode(['typ' => 'JWT', 'alg' => JWT_ALGORITHM]);
    $payload = json_encode([
        'user_id' => $userId,
        'email' => $email,
        'role' => $role,
        'iat' => time(),
        'exp' => time() + JWT_EXPIRATION
    ]);

    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET_KEY, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }

    $header = $parts[0];
    $payload = $parts[1];
    $signature = $parts[2];

    $expectedSignature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET_KEY, true);
    $expectedBase64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));

    if ($signature !== $expectedBase64Signature) {
        return false;
    }

    $payloadData = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
    
    if ($payloadData['exp'] < time()) {
        return false;
    }

    return $payloadData;
}

function getAuthUser() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return false;
    }

    return verifyJWT($matches[1]);
}
?>
