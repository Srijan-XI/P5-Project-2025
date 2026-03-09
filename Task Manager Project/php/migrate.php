<?php
/**
 * Migration Script - Migrate JSON data to SQLite
 * Run this once to migrate existing tasks from tasks.json to the new SQLite database
 */

require_once 'config.php';
require_once 'Database.php';

$jsonFile = '../db/tasks.json';
$migrated = 0;
$errors = 0;

echo "=== Task Manager JSON to SQLite Migration ===\n\n";

// Check if JSON file exists
if (!file_exists($jsonFile)) {
    echo "No tasks.json file found. Nothing to migrate.\n";
    exit(0);
}

// Read JSON file
$jsonContent = file_get_contents($jsonFile);
$tasks = json_decode($jsonContent, true);

if (!is_array($tasks) || empty($tasks)) {
    echo "No tasks found in JSON file.\n";
    exit(0);
}

echo "Found " . count($tasks) . " tasks to migrate.\n\n";

try {
    $db = new Database(DB_PATH);
    
    foreach ($tasks as $task) {
        if (isset($task['description'])) {
            try {
                $db->addTask($task['description']);
                $migrated++;
                echo "✓ Migrated: " . substr($task['description'], 0, 50) . "...\n";
            } catch (Exception $e) {
                $errors++;
                echo "✗ Error migrating task: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "\n=== Migration Complete ===\n";
    echo "Successfully migrated: $migrated tasks\n";
    echo "Errors: $errors\n";
    
    if ($errors === 0 && $migrated > 0) {
        // Backup JSON file
        $backupFile = $jsonFile . '.backup.' . date('Y-m-d_His');
        copy($jsonFile, $backupFile);
        echo "\nOriginal JSON backed up to: $backupFile\n";
        echo "You can safely delete the backup file after verifying the migration.\n";
    }
    
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
