<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) exit;

$db = new SQLite3('../db/tasks.db');
$stmt = $db->prepare('DELETE FROM tasks WHERE id = :id');
$stmt->bindValue(':id', $data['id'], SQLITE3_INTEGER);
$stmt->execute();
echo json_encode(['success' => true]);
?>
