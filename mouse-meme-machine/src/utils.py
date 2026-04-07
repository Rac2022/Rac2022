import json
import os
import time
import datetime

# Supported file extensions
IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".gif")
SOUND_EXTENSIONS = (".mp3", ".wav", ".ogg")


def get_project_root():
    """Return the project root directory (parent of src/)."""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def resolve_path(relative_path):
    """Resolve a path relative to the project root."""
    return os.path.join(get_project_root(), relative_path)


def load_config(config_path=None):
    """Load configuration from config.json. Returns defaults on failure."""
    if config_path is None:
        config_path = resolve_path("config.json")

    defaults = {
        "sound_enabled": True,
        "popup_enabled": True,
        "sound_volume": 0.7,
        "popup_duration": 1.0,
        "popup_size": [250, 250],
        "cooldown_seconds": 1.0,
        "sounds_dir": "assets/sounds",
        "images_dir": "assets/images",
    }

    try:
        with open(config_path, "r") as f:
            user_config = json.load(f)
        defaults.update(user_config)
    except FileNotFoundError:
        log("config.json not found, using defaults")
    except json.JSONDecodeError as e:
        log(f"config.json parse error: {e}, using defaults")

    return defaults


def load_files_from_dir(directory, valid_extensions):
    """Return a list of file paths from a directory filtered by extensions.

    Returns an empty list if the directory is missing or empty.
    """
    if not os.path.isdir(directory):
        log(f"Directory not found: {directory}")
        return []

    files = [
        os.path.join(directory, f)
        for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f))
        and f.lower().endswith(valid_extensions)
    ]

    if not files:
        log(f"No valid files in: {directory}")

    return sorted(files)


def log(message):
    """Print a timestamped log message to the terminal."""
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")


class CooldownTimer:
    """Prevents actions from firing too frequently."""

    def __init__(self, cooldown_seconds):
        self.cooldown = cooldown_seconds
        self._last_trigger = 0.0

    def is_ready(self):
        now = time.time()
        if now - self._last_trigger >= self.cooldown:
            self._last_trigger = now
            return True
        return False
