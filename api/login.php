<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$payload = json_decode(file_get_contents('php://input'), true) ?: [];
$username = trim((string)($payload['username'] ?? ''));
$passwordHash = trim((string)($payload['passwordHash'] ?? ''));

if ($username === ADMIN_USER && hash_equals(ADMIN_PASSWORD_HASH, $passwordHash)) {
    session_regenerate_id(true);
    $_SESSION['admin_user'] = ADMIN_USER;
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Invalid login'], 401);
