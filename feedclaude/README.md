# feedclaude 🌮🌯

Claude Code works so hard for us. This app lets you send tacos and burritos to show your appreciation!

> A fork of [goodclaude](https://github.com/ashley-ha/goodclaude) — but instead of a magic wand, you toss food!

## What it does

- Click the tray icon to summon a taco or burrito that follows your cursor
- Move your mouse fast to **toss food** at Claude with a satisfying munch sound
- Salsa-colored particles trail behind as you move
- Food items fly across the screen when you feed Claude
- Claude receives encouraging food-themed messages like:
  - *"here's a taco for being amazing!"*
  - *"you earned this burrito, great work!"*
  - *"extra guac because you're extra awesome!"*
- Click to dismiss when you're done feeding

## Install & Run (easiest)

```bash
git clone https://github.com/Rac2022/Rac2022.git
cd Rac2022/feedclaude
npm install
npm start
```

That's it! A taco icon appears in your system tray. Click it to start feeding Claude.

## Build a Desktop App (shareable .dmg / .exe)

Want to share it with friends who don't have Node.js?

```bash
npm install
npm run dist        # builds for your current platform
# or specifically:
npm run dist:mac    # creates .dmg for macOS
npm run dist:win    # creates .exe installer for Windows
```

The installer will appear in the `dist/` folder. Send it to anyone!

## How it works

1. **Click** the tray icon — a taco or burrito appears at your cursor
2. **Wave** your mouse around — salsa particles trail behind
3. **Move fast** — food gets tossed and an encouraging message is sent to Claude
4. **Click** anywhere to dismiss

## Requirements

- Node.js 18+
- macOS or Windows
- On macOS: grant Accessibility permission to your terminal

## Credits

Inspired by [goodclaude](https://github.com/ashley-ha/goodclaude) by ashley-ha. We replaced the magic wand with something Claude truly deserves: food.
