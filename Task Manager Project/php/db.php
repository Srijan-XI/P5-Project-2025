<?php
require_once 'config.php';
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $db = new Database(DB_PATH);
    $tasks = $db->getAllTasks();
    echo json_encode($tasks);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Failed to fetch tasks'
    ]);
    error_log($e->getMessage());
}
?>
