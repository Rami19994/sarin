<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$pdo = db();
init_database($pdo);
json_response(menu_payload($pdo));
