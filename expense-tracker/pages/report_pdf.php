<?php
require '../vendor/tcpdf/tcpdf.php';
include '../includes/db.php';

$conn = (new Database())->getConnection();
$stmt = $conn->prepare("SELECT * FROM expenses WHERE user_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$data = $stmt->fetchAll();

$pdf = new TCPDF();
$pdf->AddPage();
$pdf->SetFont('helvetica', '', 12);
$html = "<h2>Expense Report</h2><table border='1' cellpadding='4'><tr><th>Date</th><th>Amount</th><th>Category</th><th>Description</th></tr>";

foreach ($data as $row) {
    $html .= "<tr><td>{$row['expense_date']}</td><td>₹{$row['amount']}</td><td>{$row['category']}</td><td>{$row['description']}</td></tr>";
}
$html .= "</table>";
$pdf->writeHTML($html);
$pdf->Output('expense_report.pdf', 'I');
?>
