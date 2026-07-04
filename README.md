# 🎮 Dots and Boxes - Webxdc for Delta Chat

A classic, nostalgic, and engaging "Dots and Boxes" game developed exclusively for the **Delta Chat** messenger platform as a **Webxdc** application. This project is built with a strong focus on smooth user experience, flawless network synchronization in online mode, and a lightweight zero-dependency architecture.

---

## ✨ Key Features

### 1. Three Diverse Game Modes 🎯
- **Single Player (Bot):** Play against a smart bot (with a 🤖 icon) when you're playing solo.
- **Local Multiplayer:** Play with a friend on a single shared device.
- **Online Multiplayer:** Compete remotely with friends directly inside Delta Chat.

### 2. Smart Network Sync & High Stability 🌐
To prevent color clashes and game state desyncs during slow or unstable internet connections, a **Network Address Sorting (`sortedAddrs`)** system is implemented. The player with the smaller address is always assigned Blue (⭐) and the larger address is Red (🌸). This architecture guarantees a deterministic and perfectly synchronized game state across all devices.

### 3. Advanced Zero-Dependency Audio (Web Audio API) 🎵
Due to Webxdc constraints regarding heavy external media files, **all game sounds are purely synthesized using mathematical code**!
- 💧 **Drop/Pop (Jeez):** A soft, pleasing sound when capturing a box, designed to be fatigue-free.
- 🎉 **Tada:** An exciting sound effect for combo captures (4+ boxes in one turn).
- 🏆 **Victory (Win):** A delightful 4-note melody played at the end of the game.
- 🔇 **Mute Button:** A quick toggle button conveniently placed in the bottom corner.

### 4. Modern & Optimized UI 🎨
- **Toast Notifications:** Replaced annoying `alert` dialogs with animated, auto-fading toast messages at the bottom of the screen.
- **Responsive Design & Render Fixes:** Uses `Flexbox` for precise icon alignment and rendering tricks (like `void offsetHeight`) to ensure flawless execution on older devices (e.g., Samsung J7).
- **Smart Name Management:** Automatically distinguishes identical player names in online mode by appending numbers (e.g., A1 and A2).

### 5. Fair Voting System 🤝
In online multiplayer mode, restarting the game relies on a fair voting mechanism. The game will only reset when both players click the "Restart" button (2/2 votes required).

---

## 🛠 Tech Stack
- **HTML5 & CSS3:** For structure and styling (including CSS transitions/animations).
- **Vanilla JavaScript (ES6):** For complex game logic without relying on any external libraries.
- **Web Audio API (Oscillator):** For generating zero-dependency sound effects.
- **Webxdc API:** For real-time communication and data exchange within Delta Chat.

---

## 📂 File Structure
The project utilizes a clean and straightforward architecture:
- `index.html`: The main body of the game, Mute button, and Toast container.
- `style.css`: Game styles, grid layouts, and animations.
- `app.js`: Core game logic, Webxdc management, audio synthesizer, and win-state logic.
- `icon.png`: Custom game logo displayed within Delta Chat.
- `webxcdc.js`: A mock script for local testing in the browser (without needing the Delta Chat app).

---

## 🚀 How to Build and Play

To run this game in Delta Chat:
1. Select all the project files (`index.html`, `style.css`, `app.js`, and `icon.png`).
2. Compress them into a `.zip` archive.
3. Rename the file extension from `.zip` to `.xdc` (e.g., `dots-and-boxes.xdc`).
4. Send the generated file in any Delta Chat conversation and start playing!

---
*Developed with ❤️ for the Delta Chat community.*


# 🎮 نقطه‌بازی (Dots and Boxes) - Webxdc for Delta Chat

یک بازی کلاسیک، نوستالژیک و جذاب «نقطه‌بازی» که به صورت اختصاصی برای پلتفرم پیام‌رسان **Delta Chat** و در قالب برنامه **Webxdc** توسعه یافته است. این بازی با تمرکز بر تجربه کاربری روان، همگام‌سازی بی‌نقص شبکه در حالت آنلاین و طراحی بدون نیاز به فایل‌های خارجی (Zero-Dependency) ساخته شده است.

---

## ✨ ویژگی‌ها و امکانات برجسته

### ۱. سه حالت بازی متنوع 🎯
- **بازی با ربات (Single Player):** رقابت با یک ربات هوشمند (با آیکون 🤖) برای زمان‌هایی که تنها هستید.
- **دونفره آفلاین (Local Multiplayer):** بازی دو نفره روی یک گوشی مشترک (مناسب برای دورهمی‌ها).
- **دونفره آنلاین (Online Multiplayer):** رقابت از راه دور با دوستان در چت‌های Delta Chat.

### ۲. همگام‌سازی شبکه و پایداری بالا (Smart Network Sync) 🌐
برای جلوگیری از تداخل رنگ‌ها و به‌هم‌ریختگی بازی هنگام کندی یا قطعی اینترنت، از سیستم **مرتب‌سازی آدرس‌های شبکه (`sortedAddrs`)** استفاده شده است. بازیکن دارای آدرس کوچک‌تر همیشه آبی (⭐) و بازیکن دیگر همیشه قرمز (🌸) خواهد بود. این معماری تضمین می‌کند که وضعیت بازی در تمام دستگاه‌ها کاملاً یکسان (Deterministic) باقی بماند.

### ۳. صداگذاری پیشرفته بدون فایل خارجی (Web Audio API) 🎵
به دلیل محدودیت‌های برنامه‌های xdc در بارگذاری فایل‌های صوتی سنگین، **تمام صداهای بازی به صورت سینتی‌سایزر و با کدهای ریاضی** تولید شده‌اند!
- 💧 **صدای قطره (Jeez):** صدایی ملایم و گوش‌نواز هنگام گرفتن یک خانه (بدون ایجاد خستگی برای کاربر).
- 🎉 **صدای تادا (Tada):** افکت صوتی جذاب برای زمانی که یک بازیکن به صورت کمبو بیش از ۴ خانه را تسخیر می‌کند.
- 🏆 **صدای پیروزی (Win):** یک ملودی ۴ نتی دلنشین در پایان بازی.
- 🔇 **دکمه بی‌صدا (Mute):** امکان قطع و وصل سریع صداها تعبیه شده در گوشه تصویر.

### ۴. رابط کاربری (UI) مدرن و بهینه 🎨
- **پیام‌های موقت (Toast Notifications):** جایگزینی پنجره‌های آزاردهنده `alert` با سیستم پیام موقتِ انیمیشن‌دار در پایین صفحه.
- **طراحی ریسپانسیو و رفع باگ‌های رندر:** استفاده از `Flexbox` برای وسط‌چین کردن دقیق المان‌ها و استفاده از تریک‌های رندرینگ (`void offsetHeight`) برای اجرای بدون نقص بازی در گوشی‌های قدیمی (مانند Samsung J7).
- **مدیریت نام‌ها:** اگر نام هر دو بازیکن در حالت آنلاین یکسان باشد، سیستم به صورت خودکار آنها را با اعداد متمایز می‌کند (مثل A1 و A2).

### ۵. سیستم رأی‌گیری منصفانه 🤝
در حالت بازی آنلاین، برای شروع مجدد بازی (Restart) از یک سیستم رأی‌گیری استفاده شده است. بازی تنها زمانی از اول شروع می‌شود که هر دو بازیکن روی دکمه «از اول» کلیک کنند (۲/۲ رأی).

---

## 🛠 فناوری‌های استفاده شده
- **HTML5 & CSS3:** برای ساختار و استایل‌دهی (همراه با انیمیشن‌های CSS).
- **Vanilla JavaScript (ES6):** برای منطق پیچیده بازی بدون استفاده از هیچ کتابخانه جانبی.
- **Web Audio API (Oscillator):** برای تولید افکت‌های صوتی.
- **Webxdc API:** برای ارتباط و تبادل دیتا در بستر Delta Chat.

---

## 📂 ساختار فایل‌ها
پروژه از یک معماری ساده و یکپارچه بهره می‌برد:
- `index.html`: بدنه اصلی بازی، دکمه Mute و کانتینر Toast.
- `style.css`: استایل‌های بازی، شبکه نقطه‌ها و انیمیشن‌ها.
- `app.js`: هسته اصلی بازی، مدیریت Webxdc، سینت‌سایزر صدا و منطق برنده‌شدن.
- `icon.png`: لوگوی اختصاصی بازی برای نمایش در Delta Chat.
- `webxcdc.js`: فایل شبیه‌ساز (Mock) برای تست لوکال بازی در مرورگر (بدون نیاز به دلتا چت).

---

## 🚀 نحوه اجرا و ساخت فایل Webxdc

برای اجرای این بازی در Delta Chat:
1. تمام فایل‌های پروژه (`index.html`، `style.css`، `app.js` و `icon.png`) را انتخاب کنید.
2. آن‌ها را در یک فایل `.zip` فشرده کنید.
3. پسوند فایل را از `.zip` به `.xdc` تغییر دهید (مثلاً `dots-and-boxes.xdc`).
4. فایل ساخته شده را در یک چت در پیام‌رسان Delta Chat ارسال کرده و از بازی لذت ببرید!

---
*توسعه یافته با ❤️ برای جامعه Delta Chat*
