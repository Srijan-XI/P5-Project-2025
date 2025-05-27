<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'], $data['description'])) exit;

$db = new SQLite3('../db/tasks.db');
$stmt = $db->prepare('UPDATE tasks SET description = :description WHERE id = :id');
$stmt->bindValue(':description', $data['description'], SQLITE3_TEXT);
$stmt->bindValue(':id', $data['id'], SQLITE3_INTEGER);
$stmt->execute();
echo json_encode(['success' => true]);
?>
