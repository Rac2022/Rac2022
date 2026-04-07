import random
import threading
import tkinter as tk
from PIL import Image, ImageTk
from src.utils import load_files_from_dir, resolve_path, log, IMAGE_EXTENSIONS


class MemePopup:
    """Displays a random meme image in a borderless popup near the cursor."""

    def __init__(self, images_dir, popup_size=(250, 250), duration=1.0):
        self.popup_size = popup_size
        self.duration = duration

        full_path = resolve_path(images_dir)
        self.image_paths = load_files_from_dir(full_path, IMAGE_EXTENSIONS)
        log(f"Meme popup ready: {len(self.image_paths)} image(s) found")

    def show(self, x, y):
        """Show a random meme popup near the given screen coordinates."""
        if not self.image_paths:
            log("No meme images available to show")
            return

        image_path = random.choice(self.image_paths)
        log(f"Showing meme: {image_path}")
        thread = threading.Thread(
            target=self._display, args=(x, y, image_path), daemon=True
        )
        thread.start()

    def _display(self, x, y, image_path):
        """Render the popup window in its own thread."""
        root = tk.Tk()
        root.overrideredirect(True)
        root.attributes("-topmost", True)
        root.configure(bg="black")

        width, height = self.popup_size
        # Offset slightly so the popup doesn't land right under the cursor
        root.geometry(f"{width}x{height}+{x + 15}+{y + 15}")

        try:
            img = Image.open(image_path)
            img = img.resize((width, height), Image.LANCZOS)
            photo = ImageTk.PhotoImage(img)
            label = tk.Label(root, image=photo, borderwidth=0)
            label.image = photo  # prevent garbage collection
            label.pack()
        except Exception as e:
            log(f"Error displaying image {image_path}: {e}")
            label = tk.Label(
                root, text="MEME!", font=("Arial", 24, "bold"),
                fg="white", bg="black",
            )
            label.pack(expand=True)

        root.after(int(self.duration * 1000), root.destroy)
        root.mainloop()
