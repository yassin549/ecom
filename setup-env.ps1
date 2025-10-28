@"
DATABASE_URL="file:./dev.db"
"@ | Out-File -FilePath .env -Encoding utf8 -NoNewline
Write-Host ".env file created successfully!"
