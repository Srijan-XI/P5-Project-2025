# PowerShell script to automatically enable SQLite3 extension
# Run as Administrator

$phpIniPath = "C:\Program Files\php-8.4.6-Win32-vs17-x64\php.ini"

Write-Host "Enabling SQLite3 in php.ini..." -ForegroundColor Yellow
Write-Host "File: $phpIniPath" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path $phpIniPath)) {
    Write-Host "ERROR: php.ini not found at $phpIniPath" -ForegroundColor Red
    pause
    exit 1
}

# Read the file
$content = Get-Content $phpIniPath

# Enable extension=sqlite3
$content = $content -replace '^;extension=sqlite3', 'extension=sqlite3'

# Enable extension_dir
$content = $content -replace '^;extension_dir\s*=\s*"ext"', 'extension_dir = "ext"'

# Write back
$content | Set-Content $phpIniPath

Write-Host "SUCCESS! SQLite3 has been enabled!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close ALL terminal windows" -ForegroundColor White
Write-Host "2. Open a new terminal" -ForegroundColor White
Write-Host "3. Run: php php/test_sqlite.php" -ForegroundColor White
Write-Host "4. If test passes, run: .\start.bat" -ForegroundColor White
Write-Host ""
pause
