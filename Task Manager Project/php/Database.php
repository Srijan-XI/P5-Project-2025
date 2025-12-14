<?php
/**
 * Database Class - Handles SQLite operations with security and error handling
 */
class Database {
    private $db;
    private $dbPath;

    public function __construct($dbPath) {
        $this->dbPath = $dbPath;
        $this->connect();
        $this->createTables();
    }

    /**
     * Establish database connection
     */
    private function connect() {
        // Check if SQLite3 is available
        if (!class_exists('SQLite3')) {
            $errorMsg = "SQLite3 extension is not enabled in PHP.\n\n" .
                       "To fix this:\n" .
                       "1. Locate your php.ini file (run: php --ini)\n" .
                       "2. Find the line: ;extension=sqlite3\n" .
                       "3. Remove the semicolon to uncomment it: extension=sqlite3\n" .
                       "4. Restart your web server or terminal\n\n" .
                       "For Windows: The extension should be in ext/php_sqlite3.dll";
            
            error_log("CRITICAL: " . $errorMsg);
            throw new Exception("SQLite3 extension not enabled. Check error log for details.");
        }

        try {
            // Ensure directory exists
            $dir = dirname($this->dbPath);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            $this->db = new SQLite3($this->dbPath);
            $this->db->busyTimeout(5000);
            
            // Enable foreign keys
            $this->db->exec('PRAGMA foreign_keys = ON');
            
            // Enable WAL mode for better concurrency
            $this->db->exec('PRAGMA journal_mode = WAL');
            
        } catch (Exception $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    /**
     * Create tables if they don't exist
     */
    private function createTables() {
        $sql = "
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                priority TEXT DEFAULT 'medium',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_completed ON tasks(completed);
            CREATE INDEX IF NOT EXISTS idx_created_at ON tasks(created_at);
        ";

        try {
            $this->db->exec($sql);
        } catch (Exception $e) {
            error_log("Table creation failed: " . $e->getMessage());
            throw new Exception("Database initialization failed");
        }
    }

    /**
     * Get all tasks
     */
    public function getAllTasks() {
        try {
            $query = "SELECT * FROM tasks ORDER BY created_at DESC";
            $result = $this->db->query($query);
            
            $tasks = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $row['completed'] = (bool)$row['completed'];
                $tasks[] = $row;
            }
            
            return $tasks;
        } catch (Exception $e) {
            error_log("Get tasks failed: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Add a new task
     */
    public function addTask($description, $priority = 'medium') {
        // Sanitize input
        $description = $this->sanitize($description);
        $priority = $this->sanitizePriority($priority);

        // Validate
        if (empty($description)) {
            throw new Exception("Task description cannot be empty");
        }

        if (strlen($description) > MAX_TASK_LENGTH) {
            throw new Exception("Task description too long (max " . MAX_TASK_LENGTH . " characters)");
        }

        try {
            $stmt = $this->db->prepare(
                "INSERT INTO tasks (description, priority) VALUES (:desc, :priority)"
            );
            $stmt->bindValue(':desc', $description, SQLITE3_TEXT);
            $stmt->bindValue(':priority', $priority, SQLITE3_TEXT);
            
            $result = $stmt->execute();
            
            return [
                'success' => true,
                'id' => $this->db->lastInsertRowID()
            ];
        } catch (Exception $e) {
            error_log("Add task failed: " . $e->getMessage());
            throw new Exception("Failed to add task");
        }
    }

    /**
     * Update task
     */
    public function updateTask($id, $description, $completed = null, $priority = null) {
        $id = (int)$id;
        $description = $this->sanitize($description);

        if (empty($description)) {
            throw new Exception("Task description cannot be empty");
        }

        if (strlen($description) > MAX_TASK_LENGTH) {
            throw new Exception("Task description too long");
        }

        try {
            // Build dynamic query
            $updates = ["description = :desc", "updated_at = CURRENT_TIMESTAMP"];
            $params = [':id' => $id, ':desc' => $description];

            if ($completed !== null) {
                $updates[] = "completed = :completed";
                $params[':completed'] = (int)(bool)$completed;
            }

            if ($priority !== null) {
                $priority = $this->sanitizePriority($priority);
                $updates[] = "priority = :priority";
                $params[':priority'] = $priority;
            }

            $sql = "UPDATE tasks SET " . implode(', ', $updates) . " WHERE id = :id";
            $stmt = $this->db->prepare($sql);

            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            $stmt->execute();

            return ['success' => true];
        } catch (Exception $e) {
            error_log("Update task failed: " . $e->getMessage());
            throw new Exception("Failed to update task");
        }
    }

    /**
     * Toggle task completion
     */
    public function toggleComplete($id) {
        $id = (int)$id;

        try {
            $stmt = $this->db->prepare(
                "UPDATE tasks SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = :id"
            );
            $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
            $stmt->execute();

            return ['success' => true];
        } catch (Exception $e) {
            error_log("Toggle complete failed: " . $e->getMessage());
            throw new Exception("Failed to toggle task");
        }
    }

    /**
     * Delete task
     */
    public function deleteTask($id) {
        $id = (int)$id;

        try {
            $stmt = $this->db->prepare("DELETE FROM tasks WHERE id = :id");
            $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
            $stmt->execute();

            return ['success' => true];
        } catch (Exception $e) {
            error_log("Delete task failed: " . $e->getMessage());
            throw new Exception("Failed to delete task");
        }
    }

    /**
     * Sanitize input string
     */
    private function sanitize($input) {
        $input = trim($input);
        $input = strip_tags($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        return $input;
    }

    /**
     * Sanitize priority value
     */
    private function sanitizePriority($priority) {
        $validPriorities = ['low', 'medium', 'high'];
        $priority = strtolower(trim($priority));
        return in_array($priority, $validPriorities) ? $priority : 'medium';
    }

    /**
     * Close database connection
     */
    public function __destruct() {
        if ($this->db) {
            $this->db->close();
        }
    }
}
?>
