#!/usr/bin/env python3
"""Mouse Meme Machine - Plays sounds and shows memes on mouse clicks."""

import signal
import sys
from pynput.mouse import Button

from src.mouse_listener import MouseListener
from src.sound_player import SoundPlayer
from src.meme_popup import MemePopup
from src.utils import load_config, get_asset_path, CooldownTimer


def main():
    config = load_config(get_asset_path("config.json"))

    # Set up sound player
    sound_player = SoundPlayer(volume=config["sound_volume"])
    for name, path in config["sounds"].items():
        sound_player.load_sound(name, get_asset_path(path))

    # Set up meme popup
    meme_images = [get_asset_path(p) for p in config["meme_images"]]
    meme_popup = MemePopup(
        meme_images,
        popup_size=tuple(config["popup_size"]),
        duration=config["popup_duration"],
    )

    cooldown = CooldownTimer(config["cooldown_seconds"])

    # Button name mapping
    button_map = {
        Button.left: "left_click",
        Button.right: "right_click",
        Button.middle: "middle_click",
    }

    def on_click(x, y, button):
        if not cooldown.is_ready():
            return
        name = button_map.get(button)
        if config["click_sound_enabled"] and name:
            sound_player.play(name)

    def on_double_click(x, y, button):
        if config["meme_popup_enabled"]:
            meme_popup.show(x, y)

    listener = MouseListener(on_click, on_double_click)
    listener_thread = listener.start()

    print("Mouse Meme Machine is running! Press Ctrl+C to stop.")

    def shutdown(sig, frame):
        print("\nShutting down...")
        listener.stop()
        sound_player.cleanup()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    listener_thread.join()


if __name__ == "__main__":
    main()
