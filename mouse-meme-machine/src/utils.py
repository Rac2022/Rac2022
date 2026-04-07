import json
import os
import time


def load_config(config_path="config.json"):
    """Load configuration from JSON file."""
    with open(config_path, "r") as f:
        return json.load(f)


def get_asset_path(relative_path):
    """Resolve an asset path relative to the project root."""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(project_root, relative_path)


class CooldownTimer:
    """Simple cooldown timer to prevent spam."""

    def __init__(self, cooldown_seconds):
        self.cooldown = cooldown_seconds
        self._last_trigger = 0

    def is_ready(self):
        now = time.time()
        if now - self._last_trigger >= self.cooldown:
            self._last_trigger = now
            return True
        return False
