<?php
$dbFile = '../db/tasks.db';

// Create DB if not exists
if (!file_exists($dbFile)) {
    $db = new SQLite3($dbFile);
    $db->exec("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL)");
} else {
    $db = new SQLite3($dbFile);
}

// Get all tasks
header('Content-Type: application/json');
$result = $db->query('SELECT * FROM tasks ORDER BY id DESC');
$tasks = [];
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $tasks[] = $row;
}
echo json_encode($tasks);
?>
