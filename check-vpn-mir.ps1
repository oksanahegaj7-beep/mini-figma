# check-vpn-mir.ps1
# Проверка, идёт ли трафик через локальный прокси VPN MIR (127.0.0.1:10808)

$proxy = "http://127.0.0.1:10808"
$env:HTTP_PROXY  = $proxy
$env:HTTPS_PROXY = $proxy
$env:NO_PROXY    = "localhost,127.0.0.1,::1,vpnmirapis.com,vpnmir.xyz"

$trace = curl.exe -s --max-time 20 https://chatgpt.com/cdn-cgi/trace

$line = [string]($trace -split "`n" | Where-Object { $_ -match '^loc=' } | Select-Object -First 1)
$loc = ($line -replace '^loc=', '').Trim()

if ([string]::IsNullOrEmpty($loc)) {
    Write-Host "[!] Не удалось определить локацию. Проверьте интернет и работу VPN MIR." -ForegroundColor Yellow
    exit 2
}

if ($loc -eq "RU") {
    Write-Host "Трафик идёт мимо VPN, проверьте настройки" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Успешное подключение через VPN MIR. Текущая локация: $loc" -ForegroundColor Green
    exit 0
}
