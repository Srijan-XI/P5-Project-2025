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
    $result = $db->deleteTask($data['id']);
    
    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
    error_log("Delete task error: " . $e->getMessage());
}
?>
