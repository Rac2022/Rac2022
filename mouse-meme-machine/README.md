# Mouse Meme Machine

A desktop meme reaction app that plays a random sound and shows a random meme image every time you click your mouse.

## Features

- Detects global mouse clicks (left, right, middle) via `pynput`
- Plays a random sound from `assets/sounds/` on each click
- Shows a random meme image in a borderless popup near the cursor
- Popup disappears automatically after 1 second
- Cooldown prevents spam (configurable)
- Timestamped logging to the terminal
- Gracefully handles missing or empty asset folders

## Setup

```bash
pip install -r requirements.txt
```

Add your files to the asset folders:

- **Sounds** in `assets/sounds/` -- supported: `.mp3`, `.wav`, `.ogg`
- **Images** in `assets/images/` -- supported: `.png`, `.jpg`, `.jpeg`, `.gif`

> **Note:** `.mp3` playback depends on your system's codec support. If you experience issues, `.wav` is the safest format for cross-platform compatibility.

## Usage

```bash
python main.py
```

Press `Ctrl+C` to stop.

## Configuration

Edit `config.json` to customize behavior:

| Setting | Default | Description |
|---|---|---|
| `sound_enabled` | `true` | Toggle sound playback on/off |
| `popup_enabled` | `true` | Toggle meme popups on/off |
| `sound_volume` | `0.7` | Volume level (`0.0` - `1.0`) |
| `popup_duration` | `1.0` | Popup display time in seconds |
| `popup_size` | `[250, 250]` | Popup dimensions `[width, height]` |
| `cooldown_seconds` | `1.0` | Minimum seconds between triggers |
| `sounds_dir` | `"assets/sounds"` | Directory to scan for sound files |
| `images_dir` | `"assets/images"` | Directory to scan for image files |

## Project Structure

```
mouse-meme-machine/
├── main.py               # Entry point
├── config.json           # Configuration
├── requirements.txt      # Python dependencies
├── assets/
│   ├── sounds/           # Sound files (.mp3, .wav, .ogg)
│   └── images/           # Meme images (.png, .jpg, .jpeg, .gif)
└── src/
    ├── mouse_listener.py # Global mouse click detection (pynput)
    ├── sound_player.py   # Random sound playback (pygame)
    ├── meme_popup.py     # Borderless image popup (tkinter + Pillow)
    └── utils.py          # Config, file loading, cooldown, logging
```
