<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'], $data['description'])) exit;

$tasksFile = '../db/tasks.json';
$tasks = json_decode(file_get_contents($tasksFile), true);
foreach ($tasks as &$task) {
    if ($task['id'] == $data['id']) {
        $task['description'] = $data['description'];
        break;
    }
}
file_put_contents($tasksFile, json_encode($tasks));
echo json_encode(['success' => true]);
?>
