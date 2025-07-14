<?php
include '../templates/header.php';
include '../includes/db.php';

$conn = (new Database())->getConnection();
$stmt = $conn->prepare("SELECT * FROM expenses WHERE user_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h4>Your Expenses</h4>
<table class="table table-bordered">
    <thead>
        <tr><th>Date</th><th>Amount</th><th>Category</th><th>Description</th></tr>
    </thead>
    <tbody>
        <?php foreach($data as $row): ?>
        <tr>
            <td><?= $row['expense_date'] ?></td>
            <td>₹<?= $row['amount'] ?></td>
            <td><?= $row['category'] ?></td>
            <td><?= $row['description'] ?></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<a href="report_pdf.php" class="btn btn-danger">Export PDF</a>
<a href="report_excel.php" class="btn btn-success">Export Excel</a>

<?php include '../templates/footer.php'; ?>
