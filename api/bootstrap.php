<?php
declare(strict_types=1);

const ROOT_DIR = __DIR__ . '/..';
const DB_PATH = ROOT_DIR . '/database/menu.sqlite3';
const SEED_PATH = ROOT_DIR . '/database/seed.json';
const SCHEMA_PATH = ROOT_DIR . '/database/schema.sql';
const UPLOAD_DIR = ROOT_DIR . '/uploads';
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Strict',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_start();
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_admin(): void
{
    if (empty($_SESSION['admin_user'])) {
        json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
    }
}

function db(): PDO
{
    if (!is_dir(dirname(DB_PATH))) {
        mkdir(dirname(DB_PATH), 0755, true);
    }

    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON');
    return $pdo;
}

function init_database(PDO $pdo): void
{
    $pdo->exec(file_get_contents(SCHEMA_PATH));
    seed_database($pdo);
}

function seed_database(PDO $pdo): void
{
    $hasData = (int)$pdo->query('SELECT COUNT(*) FROM settings')->fetchColumn()
        + (int)$pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn()
        + (int)$pdo->query('SELECT COUNT(*) FROM meals')->fetchColumn();
    if ($hasData > 0) {
        return;
    }

    $seed = json_decode(file_get_contents(SEED_PATH), true);
    if (!$seed) {
        return;
    }

    $settings = $seed['settings'];
    $pdo->prepare(
        'INSERT OR IGNORE INTO settings (id, name, name_ar, name_ku, logo, website) VALUES (1, ?, ?, ?, ?, ?)'
    )->execute([$settings['name'], $settings['nameAr'], $settings['nameKu'], $settings['logo'], $settings['website']]);

    $categoryStmt = $pdo->prepare(
        'INSERT OR IGNORE INTO categories (id, name, name_ar, name_ku, icon, display_order) VALUES (?, ?, ?, ?, ?, ?)'
    );
    foreach ($seed['categories'] as $category) {
        $categoryStmt->execute([$category['id'], $category['name'], $category['nameAr'], $category['nameKu'], $category['icon'], $category['displayOrder']]);
    }

    $mealStmt = $pdo->prepare(
        'INSERT OR IGNORE INTO meals (id, name, name_ar, name_ku, price, category, image, description, description_ar, description_ku, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($seed['meals'] as $meal) {
        $mealStmt->execute([
            (string)$meal['id'],
            $meal['name'],
            $meal['nameAr'],
            $meal['nameKu'],
            $meal['price'],
            $meal['category'],
            $meal['image'],
            $meal['description'] ?? '',
            $meal['descriptionAr'] ?? '',
            $meal['descriptionKu'] ?? '',
            !empty($meal['isAvailable']) ? 1 : 0,
        ]);
    }
}

function write_menu_exports(array $menu): void
{
    $json = json_encode($menu, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        throw new RuntimeException('Unable to encode menu export');
    }

    $json .= PHP_EOL;
    if (file_put_contents(SEED_PATH, $json, LOCK_EX) === false) {
        throw new RuntimeException('Unable to write seed export');
    }

    if (file_put_contents(ROOT_DIR . '/menu-data.json', $json, LOCK_EX) === false) {
        throw new RuntimeException('Unable to write public menu export');
    }
}

function normalize_asset(?string $value, string $folder): string
{
    if (!$value || !str_starts_with($value, 'data:image/')) {
        return $value ?: '';
    }

    if (!preg_match('/^data:image\/(png|jpe?g|webp|svg\+xml);base64,(.+)$/is', $value, $matches)) {
        return $value;
    }

    $extension = strtolower($matches[1]);
    $extension = str_replace(['jpeg', 'svg+xml'], ['jpg', 'svg'], $extension);
    $raw = base64_decode($matches[2], true);

    if ($raw === false) {
        return '';
    }

    $directory = UPLOAD_DIR . '/' . $folder;
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    $filename = substr(hash('sha256', $raw), 0, 24) . '.' . $extension;
    file_put_contents($directory . '/' . $filename, $raw);
    return 'uploads/' . $folder . '/' . $filename;
}

function menu_payload(PDO $pdo): array
{
    $settings = $pdo->query('SELECT * FROM settings WHERE id = 1')->fetch();
    $categories = $pdo->query('SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order, id')->fetchAll();
    $meals = $pdo->query('SELECT * FROM meals ORDER BY id')->fetchAll();

    return [
        'settings' => [
            'name' => $settings['name'],
            'nameAr' => $settings['name_ar'],
            'nameKu' => $settings['name_ku'],
            'logo' => $settings['logo'],
            'website' => $settings['website'],
        ],
        'categories' => array_map(fn($item) => [
            'id' => $item['id'],
            'name' => $item['name'],
            'nameAr' => $item['name_ar'],
            'nameKu' => $item['name_ku'],
            'icon' => $item['icon'],
            'displayOrder' => (int)$item['display_order'],
        ], $categories),
        'meals' => array_map(fn($item) => [
            'id' => $item['id'],
            'name' => $item['name'],
            'nameAr' => $item['name_ar'],
            'nameKu' => $item['name_ku'],
            'price' => $item['price'],
            'category' => $item['category'],
            'image' => $item['image'],
            'description' => $item['description'],
            'descriptionAr' => $item['description_ar'],
            'descriptionKu' => $item['description_ku'],
            'isAvailable' => (bool)$item['is_available'],
        ], $meals),
    ];
}
