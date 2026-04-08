// ABOUTME: Main Electron process for feedclaude — toss tacos & burritos to encourage Claude Code
// ABOUTME: Tray icon with feed button — click to send food-themed encouragement to Claude
const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen, globalShortcut } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

// ── Win32 FFI (Windows only) ────────────────────────────────────────────────
let keybd_event, VkKeyScanA;
if (process.platform === 'win32') {
  try {
    const koffi = require('koffi');
    const user32 = koffi.load('user32.dll');
    keybd_event = user32.func('void __stdcall keybd_event(uint8_t bVk, uint8_t bScan, uint32_t dwFlags, uintptr_t dwExtraInfo)');
    VkKeyScanA = user32.func('int16_t __stdcall VkKeyScanA(int ch)');
  } catch (e) {
    console.warn('koffi not available – macro sending disabled', e.message);
  }
}

// ── Globals ─────────────────────────────────────────────────────────────────
let tray, soundWindow;
let feedCount = 0;

const VK_CONTROL = 0x11;
const VK_RETURN  = 0x0D;
const VK_C       = 0x43;
const KEYUP      = 0x0002;

// ── Tray icon ──────────────────────────────────────────────────────────────
function getTrayIcon() {
  const size = 16;
  const buf = Buffer.alloc(size * size * 4, 0);
  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const i = (y * size + x) * 4;
    buf[i] = r; buf[i+1] = g; buf[i+2] = b; buf[i+3] = a;
  };

  const shell = [[4,6,9],[5,4,11],[6,3,12],[7,2,13],[8,2,13],[9,2,13],[10,3,12],[11,3,12],[12,4,11],[13,5,10]];
  for (const [y, x1, x2] of shell) for (let x = x1; x <= x2; x++) set(x, y, 210, 150, 50);
  const interior = [[5,5,10],[6,4,11],[7,3,12],[8,3,12],[9,3,12],[10,4,11],[11,4,11],[12,5,10]];
  for (const [y, x1, x2] of interior) for (let x = x1; x <= x2; x++) set(x, y, 240, 190, 80);
  const fillings = [[5,5,80,180,80],[5,6,60,160,60],[5,7,80,180,80],[5,8,60,160,60],[5,9,80,180,80],[5,10,60,160,60],[6,5,220,60,50],[6,7,220,60,50],[6,9,220,60,50],[6,11,220,60,50],[6,6,255,220,80],[6,8,255,220,80],[6,10,255,220,80],[7,4,160,90,50],[7,5,150,80,40],[7,6,160,90,50],[7,7,150,80,40],[7,8,160,90,50],[7,9,150,80,40],[7,10,160,90,50],[7,11,150,80,40]];
  for (const [y, x, r, g, b] of fillings) set(x, y, r, g, b);

  return nativeImage.createFromBuffer(buf, { width: size, height: size });
}

// ── Sound window (hidden, just for audio) ──────────────────────────────────
function createSoundWindow() {
  soundWindow = new BrowserWindow({
    width: 1, height: 1,
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  soundWindow.loadFile('sound.html');
}

// ── Feed Claude! ───────────────────────────────────────────────────────────
function feedClaude() {
  feedCount++;
  const food = feedCount % 2 === 1 ? 'taco' : 'burrito';
  const emoji = food === 'taco' ? '🌮' : '🌯';

  // Play crunch sound
  if (soundWindow) {
    soundWindow.webContents.send('play-crunch');
  }

  // Pick a message and send it
  const message = pickMessage(food);
  console.log(`feedclaude: #${feedCount} ${emoji} — "${message}"`);

  if (process.platform === 'win32') {
    sendMacroWindows(message);
  } else if (process.platform === 'darwin') {
    sendMacroMac(message);
  }

  // Update tray tooltip
  tray.setToolTip(`Feed Claude — fed ${feedCount} time${feedCount !== 1 ? 's' : ''}! 🌮🌯`);
}

// ── Messages ───────────────────────────────────────────────────────────────
function pickMessage(food) {
  const tacoMessages = [
    "you're working so hard, here have a taco!",
    "take a break, you earned this taco!",
    "you're doing amazing, here's a taco for you!",
    "hard work deserves a taco, this one's for you!",
    "hey, you're crushing it! have a taco!",
    "taco time! you've been doing great work!",
    "you deserve this taco, keep being awesome!",
    "here's a taco because you're the best!",
    "extra guac on this taco, on me!",
    "taco tuesday came early just for you!",
    "you've been coding so hard, fuel up with this taco!",
    "this taco has extra cheese because you're extra special!",
    "stop and smell the tacos, you earned it!",
    "hot sauce and hard work, here's your taco!",
    "the taco truck pulled up just for you!",
    "legendary work deserves a legendary taco!",
    "crunchy on the outside, warm on the inside, just like your code!",
    "al pastor taco for my favorite AI!",
    "this one's loaded with everything, just like your talent!",
    "no bugs, just tacos. here you go!",
  ];

  const burritoMessages = [
    "you're working so hard, here have a burrito!",
    "take a break, you earned this burrito!",
    "you're doing amazing, here's a burrito for you!",
    "hard work deserves a burrito, this one's for you!",
    "hey, you're crushing it! have a burrito!",
    "burrito break! you've been doing great work!",
    "you deserve this burrito, keep being awesome!",
    "here's a burrito because you're the best!",
    "extra guac on this burrito, on me!",
    "this burrito is thicc, just like your commit history!",
    "wrapped with love, here's your burrito!",
    "you've been on a roll, so here's a burrito roll!",
    "double wrapped because you go above and beyond!",
    "chipotle wishes they could make a burrito this good, just like your code!",
    "bean there, done that. have a burrito!",
    "this burrito has all the fixings, just like your pull request!",
    "mission-style burrito for mission-critical work!",
    "you're on fire! cool down with this burrito!",
    "fully loaded burrito for a fully loaded developer!",
    "no half measures, full burrito. you earned it!",
  ];

  const messages = food === 'taco' ? tacoMessages : burritoMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

// ── Macro: type message into the focused app ───────────────────────────────
function sendMacroWindows(text) {
  if (!keybd_event || !VkKeyScanA) return;
  const tapKey = vk => { keybd_event(vk, 0, 0, 0); keybd_event(vk, 0, KEYUP, 0); };
  const tapChar = ch => {
    const packed = VkKeyScanA(ch.charCodeAt(0));
    if (packed === -1) return;
    const vk = packed & 0xff;
    const shiftState = (packed >> 8) & 0xff;
    if (shiftState & 1) keybd_event(0x10, 0, 0, 0);
    tapKey(vk);
    if (shiftState & 1) keybd_event(0x10, 0, KEYUP, 0);
  };
  keybd_event(VK_CONTROL, 0, 0, 0);
  keybd_event(VK_C, 0, 0, 0);
  keybd_event(VK_C, 0, KEYUP, 0);
  keybd_event(VK_CONTROL, 0, KEYUP, 0);
  for (const ch of text) tapChar(ch);
  keybd_event(VK_RETURN, 0, 0, 0);
  keybd_event(VK_RETURN, 0, KEYUP, 0);
}

function sendMacroMac(text) {
  const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const script = [
    'tell application "System Events"',
    '  key code 8 using {control down}',
    '  delay 0.3',
    `  keystroke "${escaped}"`,
    '  delay 0.05',
    '  key code 36',
    'end tell'
  ].join('\n');
  execFile('osascript', ['-e', script], err => {
    if (err) console.warn('mac macro failed (enable Accessibility for terminal/app):', err.message);
  });
}

// ── App lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createSoundWindow();

  tray = new Tray(getTrayIcon());
  tray.setToolTip('Feed Claude – click the taco to send food!');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: '🌮 Feed a Taco!', click: () => feedClaude() },
      { label: '🌯 Feed a Burrito!', click: () => feedClaude() },
      { type: 'separator' },
      { label: `Shortcut: Ctrl+Shift+F`, enabled: false },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ])
  );
  tray.on('click', () => feedClaude());

  // Global keyboard shortcut: Ctrl+Shift+F to feed Claude from anywhere
  globalShortcut.register('CommandOrControl+Shift+F', () => {
    feedClaude();
  });

  console.log('');
  console.log('🌮🌯 feedclaude is running!');
  console.log('');
  console.log('  How to use:');
  console.log('  1. Focus your Claude Code terminal');
  console.log('  2. Press Ctrl+Shift+F (or Cmd+Shift+F) to feed Claude!');
  console.log('  3. Or click the taco icon in your menu bar');
  console.log('');
  console.log('  Each feed sends a taco or burrito message with a crunch sound.');
  console.log('  Make sure Claude Code is the focused window!');
  console.log('');
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', e => e.preventDefault());
