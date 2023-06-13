$changed_files = git diff --cached --name-only | ForEach-Object { $_ -replace "`r", "" }

if ($changed_files.Length -gt 0) {
    $commit_message = python gpt_commit_message.py $changed_files

    if (-not [string]::IsNullOrWhiteSpace($commit_message)) {
        Write-Host "Suggested commit message: $commit_message"
        Write-Host "Press ENTER to use the suggested commit message, or type a custom one and press ENTER:"
        $user_input = Read-Host

        if ([string]::IsNullOrWhiteSpace($user_input)) {
            $user_input = $commit_message
        }
    }
}

if ([string]::IsNullOrWhiteSpace($user_input)) {
    Write-Host "No commit message provided. Exiting script."
}
else {
    git commit -m "$user_input"
}
