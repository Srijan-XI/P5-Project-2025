<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) exit;

$tasksFile = '../db/tasks.json';
$tasks = json_decode(file_get_contents($tasksFile), true);
$tasks = array_filter($tasks, function($task) use ($data) {
    return $task['id'] != $data['id'];
});
file_put_contents($tasksFile, json_encode(array_values($tasks)));
echo json_encode(['success' => true]);
?>
