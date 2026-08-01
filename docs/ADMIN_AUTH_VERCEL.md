# Custom admin authentication on Vercel

The Next.js admin is fail-closed in production. It requires:

- `BLOG_ADMIN_USERNAME`
- `BLOG_ADMIN_SESSION_SECRET`
- one password verifier:
  - `BLOG_ADMIN_PASSWORD` as a Vercel Sensitive value; or
  - `BLOG_ADMIN_PASSWORD_HASH` in `scrypt:<salt>:<key>` format

`BLOG_ADMIN_AUTH_MODE=off` is ignored when `NODE_ENV=production`.

## Existing Vercel/Replit-compatible password

`BLOG_ADMIN_PASSWORD` remains supported for installations that already use a
Sensitive environment value. Set the same username/password pair independently
for Preview and Production, then redeploy the target environment. No local hash
generation is required for this path.

If both password variables exist, `BLOG_ADMIN_PASSWORD_HASH` takes precedence.
Do not add a hash unless intentionally migrating away from the raw Sensitive
password.

## Optional: generate a scrypt verifier without exposing the password

The utility reads the password from standard input or `BLOG_ADMIN_PASSWORD`. It
never prints the password or the session secret. Its only generated output is
the derived verifier that can be stored as `BLOG_ADMIN_PASSWORD_HASH`.

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
Regenerate the hash only when intentionally rotating or migrating the
credential. Changing the password, hash or session secret invalidates the
expected login/session and requires an explicit Vercel environment update
followed by a deployment; neither is automated here.

## Password visibility control

The login form includes a show/hide button beside the password field. It only
changes whether the characters are visible in that browser field while the
button is active. It does not reveal the Vercel environment value, copy the
password, store it, change it, or add it to application logs.

The control has an accessible label and pressed state, works with keyboard and
touch input, and returns the field to masked mode when the login page is
reloaded.
