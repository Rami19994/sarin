# Security Notes

This project now includes a PHP + SQLite backend for menu storage. Admin write access is protected by a PHP session before `api/admin-sync.php` accepts changes.

For production security, also enforce these server settings:

- HTTPS only.
- Server-side admin login and sessions.
- Argon2id or bcrypt password hashing.
- CSRF protection on admin forms.
- Strict upload validation for JPG, PNG, WEBP, and SVG policy decisions.
- Store uploads outside executable paths or in object storage.
- Rate limiting on login and write routes.
- Server-side authorization on every admin API route.
- Input validation and output escaping.
- Security headers: CSP, `X-Frame-Options` or `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, and HSTS.
- Audit logs for create, update, delete, and login actions.

The included pages use a Content Security Policy meta tag and avoid inline scripts. Keep `database/menu.sqlite3` outside public download access if possible, or block direct web access to the `database/` folder from the server configuration.
