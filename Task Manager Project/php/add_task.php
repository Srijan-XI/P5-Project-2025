<?php
require_once 'config.php';
require_once 'Database.php';

header('Content-Type: application/json');

try {
    // Get and validate input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['description']) || empty(trim($data['description']))) {
        http_response_code(400);
        echo json_encode([
            'error' => true,
            'message' => 'Task description is required'
        ]);
        exit;
    }

    // Get optional priority
    $priority = isset($data['priority']) ? $data['priority'] : 'medium';

    $db = new Database(DB_PATH);
    $result = $db->addTask($data['description'], $priority);
    
    http_response_code(201);
    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
    error_log("Add task error: " . $e->getMessage());
}
?>
