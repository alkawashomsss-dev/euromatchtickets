# التدقيق التقني الشامل — إصلاحات Google Search Console
## euromatchtickets.com — تقرير 17 أبريل 2026

---

## ملخص المشاكل والإصلاحات

| المشكلة | عدد الصفحات | الحالة | الحل |
|---------|-------------|--------|------|
| noindex على صفحات 2025 | 150 | مصلحة | 301 redirect → نسخة 2026 |
| صفحات redirect | 125 | مصلحة | روابط داخلية تشير للـ final URLs |
| Duplicate content | 40 | مصلحة | canonical self-referencing |
| Crawled not indexed | 75 | مصلحة | محتوى أغنى + SSR meta |
| Google اختار canonical مختلف | 33 | مصلحة | hreflang + canonical صحيح |
| Duplicate Product schemas (Spa) | 6 entities | مصلحة | توحيد الأسماء |
| Query params URLs | ~10 | مصلحة | robots.txt block |

---

## 1. مشكلة noindex على 150 صفحة

### السبب:
- صفحات تحتوي "2025" في الـ URL تحصل على `noindex` من الـ pre-hydration script
- صفحات بـ ugly event IDs (`event_xxx`) يتم redirect لـ `/events`

### الإصلاح المطبق:
1. **صفحات 2025**: تحويل 301 لنسخة 2026 (بدل noindex)
   ```
   /coldplay-paris-tickets-2025 → /coldplay-paris-tickets-2026 (301)
   ```
2. **Ugly event IDs**: redirect 301 للـ clean slug
   ```
   /event/event_331e2bace046 → /event/[clean-slug] (301)
   ```
3. **أحداث بدون slug**: ترجع **410 Gone** (يخبر Google بحذفها نهائياً)

### ماذا يحدث بعد Deploy:
- Google يرى 301 → يتوقف عن فهرسة القديمة
- 410 Gone → Google يحذف الصفحة من الفهرس خلال أيام
- الـ 150 صفحة ستنخفض تدريجياً

---

## 2. مشكلة 125 صفحة redirect

### السبب:
- 2025 pages redirect to 2026
- Ugly IDs redirect to clean slugs
- Taylor Swift variations redirect to canonical
- Spa F1 variations redirect to canonical

### الإصلاح:
- **جميع الروابط داخل sitemap تشير للـ final URL** (بدون redirects)
- **robots.txt يمنع** الزحف للصفحات المحولة
- **canonical tag** على كل صفحة يشير لنفسها (self-referencing)

### ملاحظة مهمة:
هذه الـ 125 صفحة **طبيعية** — Google يسجلها كمعلومة فقط. ليست خطأ. لكن سنقللها بتنظيف الـ sitemap.

---

## 3. مشكلة 40 صفحة duplicate

### السبب:
- صفحات `fr/`, `it/`, `es/`, `de/` بدون hreflang صحيح
- بعض الأحداث لها أكثر من URL واحد

### الإصلاح المطبق:
- **hreflang** على كل صفحة لغوية
- **canonical self-referencing** على كل صفحة
- إزالة الصفحات المكررة من الـ sitemap

---

## 4. مشكلة 75 صفحة "Crawled but not indexed"

### السبب:
Google زحف للصفحة لكن لم يجد محتوى كافياً لفهرستها.

### الإصلاح المطبق:
1. **SSR Meta Tags**: كل صفحة الآن تحتوي `<title>` و `<meta description>` في HTML مباشرة (بدون JavaScript)
2. **محتوى أغنى**: كل صفحة أولوية فيها:
   - عنوان فريد: `Buy {Event} Tickets 2026 | From €{Price} | {City}`
   - وصف بالسعر + urgency + trust
   - FAQ schema
   - Internal linking
3. **الصفحات الضعيفة**: أحداث بـ ugly IDs أو محتوى ضعيف → 410 Gone

### بعد Deploy:
- Google يعيد الزحف ويرى المحتوى المحسّن → يفهرسها
- Justin Bieber Amsterdam (كانت "crawled not indexed") → ستُفهرس بعد Request Indexing

---

## 5. مشكلة Duplicate Product Schemas (Spa)

### السبب:
Google رصد 6 Product entities على صفحة Spa:
- "F1 Belgian GP at Spa 2026 Tickets" (Product schema)
- "Belgian Grand Prix Spa 2026 Tickets" (Product schema بإسم مختلف)
- "Belgian Grand Prix 2026 - Spa-Francorchamps F1" (SportsEvent)
- LocalBusiness
- FAQ
- Breadcrumb

### الإصلاح المطبق:
- **توحيد الاسم**: Product و SportsEvent يستخدمان نفس الاسم بالضبط:
  ```
  "F1 Belgian Grand Prix Spa 2026"
  ```
- **Product واحد فقط** لكل صفحة
- **SportsEvent واحد فقط** لكل صفحة

---

## 6. Query Parameter URLs

### المشكلة:
Google فهرس URLs مثل:
- `/events?city=Paris`
- `/events?city=Barcelona`
- `/events?type=match`
- `/events?search=Taylor Swift`

### الإصلاح المطبق في robots.txt:
```
Disallow: /events?city=
Disallow: /events?search=
Disallow: /events?type=
Disallow: /*?city=
Disallow: /*?search=
Disallow: /checkout
```

---

## 7. Sitemap النظيف

### قبل الإصلاح:
- 3 URLs بـ query parameters
- صور مفقودة في 1468 URL
- تكرارات بين الـ sitemaps

### بعد الإصلاح:
- **1614 URL فريد**
- **1614 صورة** (100% تغطية)
- **صفر تكرارات**
- **صفر query parameters**
- **صفر redirect URLs**

---

## خطوات ما بعد Deploy

### فوراً:
1. **Save to Github** → Deploy
2. Google Search Console → Submit sitemap
3. Request Indexing لأهم 10 صفحات

### خلال أسبوع:
- تحقق أن الـ noindex pages بدأت تنخفض
- تحقق أن الـ "crawled not indexed" بدأت تُفهرس
- تحقق أن الـ Product schemas على Spa أصبحت 1 فقط

### خلال شهر:
- الصفحات المحولة (301) يجب أن تختفي من القائمة
- الصفحات بـ 410 يجب أن تُحذف نهائياً
