<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['description'])) exit;

$tasksFile = '../db/tasks.json';
$tasks = json_decode(file_get_contents($tasksFile), true);
if (!is_array($tasks)) $tasks = [];

$newId = 1;
if (!empty($tasks)) {
    $ids = array_column($tasks, 'id');
    $newId = max($ids) + 1;
}

$tasks[] = [
    'id' => $newId,
    'description' => $data['description']
];
file_put_contents($tasksFile, json_encode($tasks));
echo json_encode(['success' => true]);
?>
