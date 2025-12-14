<?php
require_once 'config.php';
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode([
            'error' => true,
            'message' => 'Task ID is required'
        ]);
        exit;
    }

    $db = new Database(DB_PATH);

    // Check if this is a completion toggle
    if (isset($data['completed']) && !isset($data['description'])) {
        $result = $db->toggleComplete($data['id']);
    } 
    // Regular update
    else {
        if (!isset($data['description']) || empty(trim($data['description']))) {
            http_response_code(400);
            echo json_encode([
                'error' => true,
                'message' => 'Task description is required'
            ]);
            exit;
        }

        $completed = isset($data['completed']) ? $data['completed'] : null;
        $priority = isset($data['priority']) ? $data['priority'] : null;
        
        $result = $db->updateTask($data['id'], $data['description'], $completed, $priority);
    }

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
    error_log("Update task error: " . $e->getMessage());
}
?>
