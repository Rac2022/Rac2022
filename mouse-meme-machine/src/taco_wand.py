import threading
import tkinter as tk
import math
import random
import pygame
import os
from src.utils import resolve_path, log, SOUND_EXTENSIONS


class TacoWand:
    """Animated taco wand that flies across the screen with a sparkle trail.

    Similar to the Claude Code wand animation — a taco shoots diagonally
    from the click position leaving behind a glittering particle trail,
    and plays a 'wasting' sound on trigger.
    """

    # Sparkle characters used in the trail
    SPARKLES = ["\u2728", "\u2B50", "\u2734", "\u00B7", "\u273C", "\u273A"]
    TACO = "\U0001F32E"

    def __init__(self, wasting_sound_dir=None, volume=0.7,
                 trail_length=12, duration=1.2):
        self.trail_length = trail_length
        self.duration = duration
        self.volume = volume
        self._wasting_sound = None

        # Load wasting sound from assets/wasting/ directory
        if wasting_sound_dir:
            self._load_wasting_sound(wasting_sound_dir)

        log(f"Taco wand ready (trail={trail_length}, duration={duration}s)")

    def _load_wasting_sound(self, sound_dir):
        """Load the first valid sound file from the wasting sound directory."""
        full_path = resolve_path(sound_dir)
        if not os.path.isdir(full_path):
            log(f"Wasting sound dir not found: {full_path}")
            return

        for fname in sorted(os.listdir(full_path)):
            fpath = os.path.join(full_path, fname)
            if os.path.isfile(fpath) and fname.lower().endswith(SOUND_EXTENSIONS):
                try:
                    if not pygame.mixer.get_init():
                        pygame.mixer.init()
                    self._wasting_sound = pygame.mixer.Sound(fpath)
                    self._wasting_sound.set_volume(self.volume)
                    log(f"Loaded wasting sound: {fpath}")
                    return
                except Exception as e:
                    log(f"Failed to load wasting sound {fpath}: {e}")

        log("No wasting sound files found")

    def trigger(self, x, y):
        """Launch the taco wand animation at the given screen position."""
        log(f"Taco wand triggered at ({x}, {y})")

        # Play the wasting sound
        if self._wasting_sound:
            self._wasting_sound.play()
            log("Playing wasting sound")

        # Run the animation in its own thread (tkinter needs its own mainloop)
        thread = threading.Thread(
            target=self._animate, args=(x, y), daemon=True
        )
        thread.start()

    def _animate(self, start_x, start_y):
        """Run the taco wand fly-across animation with sparkle trail."""
        root = tk.Tk()
        root.overrideredirect(True)
        root.attributes("-topmost", True)
        root.attributes("-alpha", 0.92)

        # Canvas size — the wand flies across this area
        canvas_w = 500
        canvas_h = 300

        # Position the canvas so the animation starts near the click
        win_x = start_x - 30
        win_y = start_y - canvas_h // 2
        root.geometry(f"{canvas_w}x{canvas_h}+{win_x}+{win_y}")

        # Transparent background
        root.configure(bg="black")
        try:
            root.wm_attributes("-transparentcolor", "black")
        except tk.TclError:
            pass  # Not supported on all platforms

        canvas = tk.Canvas(
            root, width=canvas_w, height=canvas_h,
            bg="black", highlightthickness=0
        )
        canvas.pack()

        # Animation state
        particles = []
        taco_id = None
        frame = [0]
        total_frames = int(self.duration * 60)  # ~60 fps target

        # Flight path: diagonal sweep from left to right with a slight curve
        def taco_pos(t):
            """Return (x, y) of the taco at time t (0.0 to 1.0)."""
            x = t * (canvas_w - 40) + 20
            y = canvas_h / 2 + math.sin(t * math.pi * 2.5) * 50
            return x, y

        # Color palette for sparkle trail
        colors = [
            "#FFD700", "#FFA500", "#FF6347", "#FFEC8B",
            "#FFFACD", "#FFC125", "#FF8C00", "#FFE4B5",
        ]

        def update():
            nonlocal taco_id
            f = frame[0]
            t = f / total_frames

            if f >= total_frames:
                root.destroy()
                return

            # Current taco position
            tx, ty = taco_pos(t)

            # Remove old taco, draw new one
            if taco_id:
                canvas.delete(taco_id)
            taco_id = canvas.create_text(
                tx, ty, text=self.TACO, font=("Arial", 32),
                fill="white"
            )

            # Spawn sparkle particles along the trail
            if f % 2 == 0:
                sparkle_char = random.choice(self.SPARKLES)
                color = random.choice(colors)
                size = random.randint(10, 20)
                # Slight random offset from the taco path
                ox = random.uniform(-15, 5)
                oy = random.uniform(-20, 20)
                pid = canvas.create_text(
                    tx + ox, ty + oy, text=sparkle_char,
                    font=("Arial", size), fill=color
                )
                particles.append({
                    "id": pid,
                    "life": self.trail_length,
                    "x": tx + ox,
                    "y": ty + oy,
                    "fade_step": 1.0 / self.trail_length,
                })

            # Update existing particles (fade out + drift down)
            alive = []
            for p in particles:
                p["life"] -= 1
                if p["life"] <= 0:
                    canvas.delete(p["id"])
                    continue

                # Drift particles slightly downward and back
                p["y"] += random.uniform(0.5, 2.0)
                p["x"] -= random.uniform(0.2, 1.0)
                canvas.coords(p["id"], p["x"], p["y"])

                # Fade by reducing font size
                alpha = p["life"] / self.trail_length
                new_size = max(6, int(18 * alpha))
                canvas.itemconfigure(
                    p["id"],
                    font=("Arial", new_size)
                )
                alive.append(p)

            particles.clear()
            particles.extend(alive)

            frame[0] += 1
            root.after(16, update)  # ~60 fps

        root.after(10, update)
        root.mainloop()
