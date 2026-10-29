# קורות חיים אינטראקטיביים: הראל אדיב

אתר קורות חיים בסגנון "סטוריז": שקף אחד בכל מסך, מעבר בהקשה, בהחלקה או בחיצים.
HTML, CSS ו-JavaScript פשוטים, בלי ספריות. מתארח בחינם ב-Vercel.

## צפייה מקומית במחשב
1. ב-VS Code מתקינים את התוסף המומלץ **Live Server**.
2. קליק ימני על `public/index.html` → **Open with Live Server** (או **Go Live** בשורת הסטטוס למטה).
3. האתר נפתח בדפדפן ומתרענן לבד בכל שמירה.

> אל תפתחו את `index.html` בלחיצה כפולה. בהמשך האתר יטען את התוכן מקובץ JSON, וזה עובד רק דרך שרת (Live Server או Vercel).

## מבנה התיקיות
| נתיב | מה יש שם |
|---|---|
| `public/` | כל מה שעולה לאתר |
| `public/index.html` | הדף הראשי |
| `public/404.html` | דף "הדף לא קיים" |
| `public/css/` | עיצוב |
| `public/js/content.js` | הטקסטים של האתר (זמני; יוחלף ב-`content.json`) |
| `public/js/app.js` | המנוע: שקפים, ניווט, טיימרים |
| `public/assets/cv/` | קובץ קורות החיים להורדה |
| `vercel.json` | הגדרות Vercel (תיקיית האתר, כותרות אבטחה) |
| `PLAN.md`, `PROGRESS.md` | התוכנית וההתקדמות |

## איך האתר מתפרסם
- כל שינוי שנכנס לענף `main` ב-GitHub מתפרסם אוטומטית לאתר החי.
- כל ענף אחר (למשל `phase-2`) מקבל כתובת תצוגה מקדימה משלו, בלי לגעת באתר החי.

## איזה לינק לשים איפה
הסיומת `?ref=` אומרת לסטטיסטיקות מאיפה הגיע המבקר. היא נמחקת מהכתובת מיד אחרי הכניסה, אז מי שמעביר את הלינק הלאה לא "נספר" כמקור הזה.

| איפה | לינק |
|---|---|
| פרופיל ו-Featured בלינקדאין | `https://harel-resume.vercel.app/?ref=linkedin` |
| בתוך קובץ הקו"ח | `https://harel-resume.vercel.app/?ref=cv` |
| חתימת מייל | `https://harel-resume.vercel.app/?ref=email` |
| הודעות וואטסאפ | `https://harel-resume.vercel.app/?ref=whatsapp` |
| QR מודפס | `https://harel-resume.vercel.app/?ref=qr` |

לינק לשקף מסוים: מוסיפים `#` ומספר השקף, למשל `https://harel-resume.vercel.app/?ref=linkedin#5`.

## עריכת טקסטים
יתווסף בשלב 5, כשהתוכן יעבור לקובץ `public/content.json`.
