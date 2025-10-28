<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['description'])) exit;

$tasksFile = '../db/tasks.json';
$tasks = json_decode(file_get_contents($tasksFile), true);
$tasks[] = [
    'id' => count($tasks) + 1,
    'description' => $data['description']
];
file_put_contents($tasksFile, json_encode($tasks));
echo json_encode(['success' => true]);
?>
