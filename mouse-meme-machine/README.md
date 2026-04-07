# Mouse Meme Machine

A desktop meme reaction app that plays a random sound and shows a random meme image every time you click your mouse — plus an animated taco wand with sparkle trail on middle-click.

## Features

- Detects global mouse clicks (left, right, middle) via `pynput`
- Plays a random sound from `assets/sounds/` on each click
- Shows a random meme image in a borderless popup near the cursor
- Popup disappears automatically after 1 second
- **Taco Wand** — middle-click launches an animated taco that flies across the screen with a glittering sparkle trail and plays a "wasting" sound (like the Claude Code wand, but taco-themed)
- Cooldown prevents spam (configurable)
- Timestamped logging to the terminal
- Gracefully handles missing or empty asset folders

## Setup

```bash
pip install -r requirements.txt
```

Add your files to the asset folders:

- **Sounds** in `assets/sounds/` — supported: `.mp3`, `.wav`, `.ogg`
- **Images** in `assets/images/` — supported: `.png`, `.jpg`, `.jpeg`, `.gif`
- **Wasting sound** in `assets/wasting/` — drop a `.wav` or `.mp3` file here for the taco wand sound effect

> **Note:** `.mp3` playback depends on your system's codec support. If you experience issues, `.wav` is the safest format for cross-platform compatibility.

## Usage

```bash
python main.py
```

| Action | Effect |
|---|---|
| Left/Right click | Random sound + meme popup |
| Middle click | Taco wand animation + wasting sound |
| Ctrl+C | Stop the app |

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
| `taco_wand_enabled` | `true` | Toggle taco wand animation on/off |
| `taco_wand_trigger` | `"middle"` | Mouse button that triggers the wand (`left`, `right`, `middle`) |
| `taco_wand_trail_length` | `12` | Number of sparkle particles in the trail |
| `taco_wand_duration` | `1.2` | Animation duration in seconds |
| `wasting_sound_dir` | `"assets/wasting"` | Directory for the wasting sound file |

## Project Structure

```
mouse-meme-machine/
├── main.py               # Entry point — wires everything together
├── config.json           # Configuration
├── requirements.txt      # Python dependencies
├── assets/
│   ├── sounds/           # Sound files (.mp3, .wav, .ogg)
│   ├── images/           # Meme images (.png, .jpg, .jpeg, .gif)
│   └── wasting/          # Wasting sound for taco wand (.wav, .mp3)
└── src/
    ├── mouse_listener.py # Global mouse click detection (pynput)
    ├── sound_player.py   # Random sound playback (pygame)
    ├── meme_popup.py     # Borderless image popup (tkinter + Pillow)
    ├── taco_wand.py      # Animated taco wand with sparkle trail
    └── utils.py          # Config, file loading, cooldown, logging
```
