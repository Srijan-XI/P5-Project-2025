# Fix PHP SQLite3 Extension Path
# Run as Administrator in PowerShell

Write-Host "=== Fixing PHP SQLite3 Configuration ===" -ForegroundColor Cyan
Write-Host ""

$phpIniPath = "C:\Program Files\php-8.4.6-Win32-vs17-x64\php.ini"
$correctExtDir = "C:\Program Files\php-8.4.6-Win32-vs17-x64\ext"

if (!(Test-Path $phpIniPath)) {
    Write-Host "ERROR: php.ini not found at $phpIniPath" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "[1/4] Reading php.ini..." -ForegroundColor Yellow
$content = Get-Content $phpIniPath -Raw

Write-Host "[2/4] Fixing extension_dir path..." -ForegroundColor Yellow
# Remove old extension_dir lines
$content = $content -replace '(?m)^;?\s*extension_dir\s*=.*$', ''

# Add correct extension_dir at the top of the file
$newContent = "extension_dir = `"$correctExtDir`"`r`n`r`n" + $content

Write-Host "[3/4] Enabling sqlite3 extension..." -ForegroundColor Yellow
# Enable extension=sqlite3 (remove semicolon if exists)
$newContent = $newContent -replace '(?m)^;(extension=sqlite3)', '$1'

# If extension=sqlite3 doesn't exist, add it
if ($newContent -notmatch 'extension=sqlite3') {
    $newContent = $newContent -replace '(extension_dir = ".*")', "`$1`r`nextension=sqlite3"
}

Write-Host "[4/4] Saving changes..." -ForegroundColor Yellow
$newContent | Set-Content $phpIniPath -NoNewline

Write-Host ""
Write-Host "SUCCESS! Configuration updated:" -ForegroundColor Green
Write-Host "  - extension_dir = `"$correctExtDir`"" -ForegroundColor White
Write-Host "  - extension=sqlite3 (enabled)" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Close ALL terminal windows and open a new one!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then test with:" -ForegroundColor Cyan
Write-Host "  php php/test_sqlite.php" -ForegroundColor White
Write-Host ""
pause
