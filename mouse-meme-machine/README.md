# Mouse Meme Machine

A fun desktop tool that plays sound effects on mouse clicks and shows meme popups on double-clicks.

## Features

- **Click sounds** - Plays different sounds for left, right, and middle mouse clicks
- **Meme popups** - Shows random meme images at the cursor on double-click
- **Configurable** - Adjust volume, popup size, duration, and cooldowns via `config.json`

## Setup

```bash
pip install -r requirements.txt
```

Add your own sound files (`.mp3`) to `assets/sounds/` and meme images (`.png`) to `assets/images/`.

## Usage

```bash
python main.py
```

Press `Ctrl+C` to stop.

## Configuration

Edit `config.json` to customize behavior:

| Setting | Description |
|---|---|
| `click_sound_enabled` | Toggle click sounds on/off |
| `meme_popup_enabled` | Toggle meme popups on/off |
| `sound_volume` | Volume level (0.0 - 1.0) |
| `popup_duration` | How long popups stay on screen (seconds) |
| `popup_size` | Popup window dimensions `[width, height]` |
| `cooldown_seconds` | Minimum time between triggers |

## Project Structure

```
mouse-meme-machine/
├── main.py              # Entry point
├── config.json          # Configuration
├── requirements.txt     # Python dependencies
├── assets/
│   ├── sounds/          # Sound effect files (.mp3)
│   └── images/          # Meme image files (.png)
└── src/
    ├── mouse_listener.py  # Mouse event detection
    ├── sound_player.py    # Sound playback via pygame
    ├── meme_popup.py      # Tkinter meme popup windows
    └── utils.py           # Config loading & utilities
```
