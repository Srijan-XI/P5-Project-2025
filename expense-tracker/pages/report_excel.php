<?php
require '../vendor/autoload.php';
include '../includes/db.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$conn = (new Database())->getConnection();
$stmt = $conn->prepare("SELECT * FROM expenses WHERE user_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$data = $stmt->fetchAll();

$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->fromArray(['Date', 'Amount', 'Category', 'Description'], NULL, 'A1');

$row = 2;
foreach ($data as $entry) {
    $sheet->setCellValue("A{$row}", $entry['expense_date']);
    $sheet->setCellValue("B{$row}", $entry['amount']);
    $sheet->setCellValue("C{$row}", $entry['category']);
    $sheet->setCellValue("D{$row}", $entry['description']);
    $row++;
}

$writer = new Xlsx($spreadsheet);
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="expense_report.xlsx"');
header('Cache-Control: max-age=0');
$writer->save('php://output');
?>
