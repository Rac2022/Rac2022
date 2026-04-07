import tkinter as tk
from PIL import Image, ImageTk
import random
import os
import threading


class MemePopup:
    """Displays meme images as popups at the cursor position."""

    def __init__(self, image_paths, popup_size=(300, 300), duration=2.0):
        self.image_paths = [p for p in image_paths if os.path.exists(p)]
        self.popup_size = popup_size
        self.duration = duration

    def show(self, x, y):
        """Show a random meme popup at the given screen position."""
        if not self.image_paths:
            print("Warning: No meme images available")
            return
        image_path = random.choice(self.image_paths)
        thread = threading.Thread(target=self._display, args=(x, y, image_path), daemon=True)
        thread.start()

    def _display(self, x, y, image_path):
        """Display the popup window (runs in its own thread)."""
        root = tk.Tk()
        root.overrideredirect(True)
        root.attributes("-topmost", True)

        width, height = self.popup_size
        root.geometry(f"{width}x{height}+{x}+{y}")

        try:
            img = Image.open(image_path)
            img = img.resize((width, height), Image.LANCZOS)
            photo = ImageTk.PhotoImage(img)
            label = tk.Label(root, image=photo)
            label.image = photo
            label.pack()
        except Exception as e:
            label = tk.Label(root, text=f"MEME\n{e}", font=("Arial", 20))
            label.pack(expand=True)

        root.after(int(self.duration * 1000), root.destroy)
        root.mainloop()
