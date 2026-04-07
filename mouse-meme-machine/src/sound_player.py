import random
import pygame
from src.utils import load_files_from_dir, resolve_path, log, SOUND_EXTENSIONS


class SoundPlayer:
    """Loads sound files from a directory and plays one at random."""

    def __init__(self, sounds_dir, volume=0.7):
        pygame.mixer.init()
        self.volume = volume
        self._sounds = []

        full_path = resolve_path(sounds_dir)
        files = load_files_from_dir(full_path, SOUND_EXTENSIONS)

        for filepath in files:
            try:
                sound = pygame.mixer.Sound(filepath)
                sound.set_volume(self.volume)
                self._sounds.append((filepath, sound))
                log(f"Loaded sound: {filepath}")
            except Exception as e:
                log(f"Failed to load sound {filepath}: {e}")

        log(f"Sound player ready: {len(self._sounds)} sound(s) loaded")

    def play_random(self):
        """Play a random loaded sound. Does nothing if no sounds are loaded."""
        if not self._sounds:
            log("No sounds available to play")
            return
        filepath, sound = random.choice(self._sounds)
        sound.play()
        log(f"Playing: {filepath}")

    def cleanup(self):
        """Shut down the pygame mixer."""
        pygame.mixer.quit()
        log("Sound player cleaned up")
