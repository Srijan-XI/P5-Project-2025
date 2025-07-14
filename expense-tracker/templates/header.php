<?php include_once '../includes/session.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Expense Tracker</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<nav class="navbar navbar-dark bg-dark p-3">
  <a class="navbar-brand" href="dashboard.php">ExpenseTracker</a>
</nav>
<div class="container mt-4">
    <div class="row">
        <div class="col-md-12">
        <?php if (is_logged_in()): ?>
            <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <?php else: ?>
            <h2>Please log in to continue.</h2>
        <?php endif; ?>
        </div>
    </div>
    
