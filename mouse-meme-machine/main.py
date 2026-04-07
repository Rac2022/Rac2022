#!/usr/bin/env python3
"""Mouse Meme Machine - A desktop meme reaction app.

Detects global mouse clicks, plays a random sound, and shows a random meme
image near the cursor. Configurable via config.json.
"""

import signal
import sys

from src.utils import load_config, log, CooldownTimer
from src.mouse_listener import MouseListener
from src.sound_player import SoundPlayer
from src.meme_popup import MemePopup


def main():
    log("Starting Mouse Meme Machine...")

    config = load_config()

    # Initialize sound player
    sound_player = SoundPlayer(
        sounds_dir=config["sounds_dir"],
        volume=config["sound_volume"],
    )

    # Initialize meme popup manager
    meme_popup = MemePopup(
        images_dir=config["images_dir"],
        popup_size=tuple(config["popup_size"]),
        duration=config["popup_duration"],
    )

    cooldown = CooldownTimer(config["cooldown_seconds"])

    def on_click(x, y, button_name):
        if not cooldown.is_ready():
            log(f"Cooldown active, ignoring {button_name} click")
            return

        if config["sound_enabled"]:
            sound_player.play_random()

        if config["popup_enabled"]:
            meme_popup.show(x, y)

    listener = MouseListener(on_click)
    listener_thread = listener.start()

    log("Mouse Meme Machine is running! Press Ctrl+C to stop.")

    def shutdown(sig, frame):
        log("Shutting down...")
        listener.stop()
        sound_player.cleanup()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    listener_thread.join()


if __name__ == "__main__":
    main()
