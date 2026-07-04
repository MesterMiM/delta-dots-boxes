# 🎮 Dots and Boxes - Webxdc for Delta Chat

A classic, nostalgic, and engaging "Dots and Boxes" game developed exclusively for the **Delta Chat** messenger platform as a **Webxdc** application. This project is built with a strong focus on smooth user experience, flawless network synchronization in online mode, and a lightweight zero-dependency architecture.

(README-fa.md): https://github.com/MesterMiM/delta-dots-boxes/blob/main/README-fa.md
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

