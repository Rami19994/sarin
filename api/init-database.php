<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$pdo = db();
init_database($pdo);
json_response(['ok' => true, 'message' => 'Database is ready', 'menu' => menu_payload($pdo)]);
