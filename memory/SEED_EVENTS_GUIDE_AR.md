# دليل إضافة الأحداث للموقع الحي
## كيفية إضافة F1, MotoGP, World Cup للموقع الحي

---

## 🚨 المشكلة
الأحداث موجودة في قاعدة بيانات Preview لكن غير موجودة في قاعدة بيانات الموقع الحي (Render).

## ✅ الحل - خطوات بسيطة

### الخطوة 1: افتح المتصفح
اذهب للروابط التالية واحداً تلو الآخر:

```
https://euromatchtickets.com/api/seed-f1-2026
```
انتظر حتى تظهر رسالة نجاح، ثم:

```
https://euromatchtickets.com/api/seed-motogp-2026
```
انتظر حتى تظهر رسالة نجاح، ثم:

```
https://euromatchtickets.com/api/add-worldcup-2026
```
انتظر حتى تظهر رسالة نجاح، ثم:

```
https://euromatchtickets.com/api/seed-premium-events
```

### الخطوة 2: تحقق
افتح الصفحات التالية للتأكد:
- https://euromatchtickets.com/f1-tickets
- https://euromatchtickets.com/motogp-tickets  
- https://euromatchtickets.com/world-cup-2026

---

## 🔧 إذا لم تعمل الروابط

استخدم Postman أو Terminal:

```bash
# إضافة F1
curl -X POST https://euromatchtickets.com/api/seed-f1-2026

# إضافة MotoGP
curl -X POST https://euromatchtickets.com/api/seed-motogp-2026

# إضافة World Cup
curl -X POST https://euromatchtickets.com/api/add-worldcup-2026

# إضافة أحداث مميزة
curl -X POST https://euromatchtickets.com/api/seed-premium-events
```

---

## ⚠️ ملاحظة مهمة

كل مرة تعمل Deploy جديد على Render، قد تحتاج لإعادة هذه الخطوات إذا تم مسح قاعدة البيانات.

**نصيحة:** استخدم MongoDB Atlas بدلاً من قاعدة بيانات Render المحلية للحفاظ على البيانات.
