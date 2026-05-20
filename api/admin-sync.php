<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    json_response(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$pdo = db();
init_database($pdo);
require_admin();

$settings = $payload['settings'] ?? [];
$categories = is_array($payload['categories'] ?? null) ? $payload['categories'] : [];
$meals = is_array($payload['meals'] ?? null) ? $payload['meals'] : [];

$pdo->beginTransaction();
try {
    $pdo->prepare(
        'INSERT INTO settings (id, name, name_ar, name_ku, logo, website, updated_at) VALUES (1, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, name_ar = excluded.name_ar, name_ku = excluded.name_ku, logo = excluded.logo, website = excluded.website, updated_at = CURRENT_TIMESTAMP'
    )->execute([
        $settings['name'] ?? 'Sareen Restaurant',
        $settings['nameAr'] ?? 'مطعم سارين',
        $settings['nameKu'] ?? 'ڕێستورانتی سارین',
        normalize_asset($settings['logo'] ?? 'assets/images/logo.svg', 'logos'),
        $settings['website'] ?? 'www.restaurantmenu.com',
    ]);

    $pdo->exec('DELETE FROM meals');
    $pdo->exec('DELETE FROM categories');

    $categoryStmt = $pdo->prepare(
        'INSERT INTO categories (id, name, name_ar, name_ku, icon, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)'
    );
    foreach ($categories as $category) {
        $id = (string)($category['id'] ?? '');
        if ($id === '') {
            continue;
        }
        $categoryStmt->execute([
            $id,
            $category['name'] ?? $category['nameAr'] ?? $id,
            $category['nameAr'] ?? $category['name'] ?? $id,
            $category['nameKu'] ?? $category['nameAr'] ?? $category['name'] ?? $id,
            normalize_asset($category['icon'] ?? '', 'categories'),
            (int)($category['displayOrder'] ?? 0),
        ]);
    }

    $mealStmt = $pdo->prepare(
        'INSERT INTO meals (id, name, name_ar, name_ku, price, category, image, description, description_ar, description_ku, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($meals as $meal) {
        $id = (string)($meal['id'] ?? '');
        if ($id === '' || empty($meal['category'])) {
            continue;
        }
        $mealStmt->execute([
            $id,
            $meal['name'] ?? $meal['nameAr'] ?? 'Meal',
            $meal['nameAr'] ?? $meal['name'] ?? 'Meal',
            $meal['nameKu'] ?? $meal['nameAr'] ?? $meal['name'] ?? 'Meal',
            $meal['price'] ?? '0 IQD',
            $meal['category'],
            normalize_asset($meal['image'] ?? '', 'foods'),
            $meal['description'] ?? '',
            $meal['descriptionAr'] ?? '',
            $meal['descriptionKu'] ?? '',
            !empty($meal['isAvailable']) ? 1 : 0,
        ]);
    }

    $pdo->commit();
} catch (Throwable $error) {
    $pdo->rollBack();
    json_response(['ok' => false, 'error' => 'Save failed'], 500);
}

json_response(['ok' => true, 'menu' => menu_payload($pdo)]);
