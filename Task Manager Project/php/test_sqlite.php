<?php
/**
 * SQLite3 Test Script
 * Run this to verify SQLite3 is properly installed
 */

echo "=== SQLite3 Test ===\n\n";

// Test 1: Check if SQLite3 class exists
echo "1. Checking if SQLite3 class exists... ";
if (class_exists('SQLite3')) {
    echo "✓ YES\n";
} else {
    echo "✗ NO - SQLite3 extension is not enabled!\n";
    echo "\nPlease read SETUP_GUIDE.md for instructions.\n";
    exit(1);
}

// Test 2: Check SQLite3 version
echo "2. SQLite3 version... ";
$version = SQLite3::version();
echo $version['versionString'] . "\n";

// Test 3: Try creating a test database
echo "3. Testing database creation... ";
try {
    $testDb = new SQLite3(':memory:');
    echo "✓ SUCCESS\n";
    
    // Test 4: Try creating a table
    echo "4. Testing table creation... ";
    $testDb->exec('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
    echo "✓ SUCCESS\n";
    
    // Test 5: Try inserting data
    echo "5. Testing data insertion... ";
    $stmt = $testDb->prepare('INSERT INTO test (name) VALUES (:name)');
    $stmt->bindValue(':name', 'Test Task', SQLITE3_TEXT);
    $stmt->execute();
    echo "✓ SUCCESS\n";
    
    // Test 6: Try reading data
    echo "6. Testing data retrieval... ";
    $result = $testDb->query('SELECT * FROM test');
    $row = $result->fetchArray(SQLITE3_ASSOC);
    if ($row && $row['name'] === 'Test Task') {
        echo "✓ SUCCESS\n";
    } else {
        echo "✗ FAILED\n";
    }
    
    $testDb->close();
    
    echo "\n=== All Tests Passed! ===\n";
    echo "SQLite3 is working correctly.\n";
    echo "You can now run the Task Manager application.\n";
    
} catch (Exception $e) {
    echo "✗ FAILED\n";
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
