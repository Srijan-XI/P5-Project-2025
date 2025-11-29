<?php
$tasksFile = '../db/tasks.json';

// Create tasks file if not exists
if (!file_exists($tasksFile)) {
    file_put_contents($tasksFile, json_encode([]));
}

// Get all tasks
header('Content-Type: application/json');
$tasks = json_decode(file_get_contents($tasksFile), true);
if (!is_array($tasks)) $tasks = [];
echo json_encode(array_reverse($tasks)); // Reverse to show latest first
?>
