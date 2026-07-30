# Custom admin authentication on Vercel

The Next.js admin is fail-closed in production. It requires all three values:

- `BLOG_ADMIN_USERNAME`
- `BLOG_ADMIN_PASSWORD_HASH` in `scrypt:<salt>:<key>` format
- `BLOG_ADMIN_SESSION_SECRET`

`BLOG_ADMIN_AUTH_MODE=off` is ignored when `NODE_ENV=production`.

## Generate a scrypt verifier without exposing the password

The utility reads the password from standard input or `BLOG_ADMIN_PASSWORD`. It
never prints the password or the session secret. Its only generated output is
the derived verifier that must be stored as `BLOG_ADMIN_PASSWORD_HASH`.

PowerShell:

```powershell
$securePassword = Read-Host "Admin password" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
  $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  $generatedHash = $plainPassword | node .\scripts\admin-password-hash.mjs generate
} finally {
  if ($plainPassword) { $plainPassword = $null }
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
```

Copy `$generatedHash` into Vercel as `BLOG_ADMIN_PASSWORD_HASH`. Do not put the
password, hash, or session secret in source control, issue comments, PR text, or
chat logs.

## Verify an existing verifier before changing Vercel

Set `BLOG_ADMIN_PASSWORD_HASH` in the local process without printing it, then
pipe the candidate password into the verifier:

```powershell
$secureHash = Read-Host "BLOG_ADMIN_PASSWORD_HASH" -AsSecureString
$hashPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureHash)
$securePassword = Read-Host "Admin password" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
  $env:BLOG_ADMIN_PASSWORD_HASH = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($hashPointer)
  $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  $plainPassword | node .\scripts\admin-password-hash.mjs verify
} finally {
  Remove-Item Env:BLOG_ADMIN_PASSWORD_HASH -ErrorAction SilentlyContinue
  if ($plainPassword) { $plainPassword = $null }
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($hashPointer)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
```

The command returns `MATCH` with exit code 0 or `NO_MATCH` with exit code 1.
Regenerate the hash only when it does not match. Changing the hash or the
session secret invalidates the expected login/session and requires an explicit
Vercel environment update followed by a deployment; neither is automated here.
