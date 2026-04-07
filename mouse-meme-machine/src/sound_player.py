import pygame
import os


class SoundPlayer:
    """Plays sound effects on mouse events."""

    def __init__(self, volume=0.7):
        pygame.mixer.init()
        self.volume = volume
        self._sounds = {}

    def load_sound(self, name, file_path):
        """Load a sound file and store it by name."""
        if os.path.exists(file_path):
            sound = pygame.mixer.Sound(file_path)
            sound.set_volume(self.volume)
            self._sounds[name] = sound
        else:
            print(f"Warning: Sound file not found: {file_path}")

    def play(self, name):
        """Play a loaded sound by name."""
        if name in self._sounds:
            self._sounds[name].play()
        else:
            print(f"Warning: Sound '{name}' not loaded")

    def set_volume(self, volume):
        """Set volume for all loaded sounds."""
        self.volume = max(0.0, min(1.0, volume))
        for sound in self._sounds.values():
            sound.set_volume(self.volume)

    def cleanup(self):
        """Clean up pygame mixer."""
        pygame.mixer.quit()
