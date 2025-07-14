<?php 
include '../templates/header.php';
include '../includes/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = (new Database())->getConnection();
    $stmt = $conn->prepare("INSERT INTO expenses (user_id, amount, category, description, expense_date)
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $_SESSION['user_id'],
        $_POST['amount'],
        $_POST['category'],
        $_POST['description'],
        $_POST['expense_date']
    ]);
    echo "<div class='alert alert-success'>Expense added!</div>";
}
?>

<h4>Add New Expense</h4>
<form method="post">
    <input name="amount" class="form-control mb-2" type="number" placeholder="Amount" required>
    <input name="category" class="form-control mb-2" type="text" placeholder="Category" required>
    <textarea name="description" class="form-control mb-2" placeholder="Description"></textarea>
    <input name="expense_date" class="form-control mb-2" type="date" required>
    <button class="btn btn-primary">Submit</button>
</form>

<?php include '../templates/footer.php'; ?>
