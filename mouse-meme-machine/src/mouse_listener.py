from pynput import mouse
from src.utils import log


class MouseListener:
    """Detects global mouse click events and invokes a callback."""

    def __init__(self, on_click_callback):
        self.on_click_callback = on_click_callback
        self._listener = None

    def _on_click(self, x, y, button, pressed):
        if not pressed:
            return

        button_name = button.name  # "left", "right", "middle"
        log(f"Click detected: {button_name} at ({x}, {y})")
        self.on_click_callback(x, y, button_name)

    def start(self):
        """Start the global mouse listener. Returns the listener thread."""
        log("Mouse listener started")
        self._listener = mouse.Listener(on_click=self._on_click)
        self._listener.start()
        return self._listener

    def stop(self):
        """Stop the mouse listener."""
        if self._listener:
            self._listener.stop()
            log("Mouse listener stopped")
