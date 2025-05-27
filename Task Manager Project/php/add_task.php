<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['description'])) exit;

$db = new SQLite3('../db/tasks.db');
$stmt = $db->prepare('INSERT INTO tasks (description) VALUES (:description)');
$stmt->bindValue(':description', $data['description'], SQLITE3_TEXT);
$stmt->execute();
echo json_encode(['success' => true]);
?>
