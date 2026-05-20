# تشغيل الموقع مع PHP و SQLite

تم استبدال Backend البايثون بنظام PHP.

قاعدة البيانات الجاهزة:

`database/menu.sqlite3`

ملفات API:

- `api/menu.php`
- `api/admin-sync.php`
- `api/login.php`
- `api/logout.php`
- `api/init-database.php`

عند الرفع على سيرفر يدعم PHP + PDO SQLite، افتح:

`/api/init-database.php`

مرة واحدة للتأكد من إنشاء الجداول والبيانات.

بعدها افتح:

- الموقع: `/index.html`
- الأدمن: `/admin/`

أي تعديل من لوحة التحكم يتم حفظه في:

`database/menu.sqlite3`

ملف الحفظ `api/admin-sync.php` محمي بجلسة PHP، لذلك يجب تسجيل الدخول من صفحة الأدمن قبل الحفظ.

ملاحظة: على هذا الجهاز PHP غير مثبت، لذلك تم إنشاء ملف قاعدة البيانات محلياً بأداة SQLite المتاحة أثناء التطوير فقط. المشروع نفسه لا يحتوي على Backend بايثون.
