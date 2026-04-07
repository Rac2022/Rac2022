from pynput import mouse
import time


class MouseListener:
    """Listens for mouse events and triggers callbacks."""

    def __init__(self, on_click_callback, on_double_click_callback=None):
        self.on_click_callback = on_click_callback
        self.on_double_click_callback = on_double_click_callback
        self._last_click_time = 0
        self._double_click_threshold = 0.3
        self._listener = None

    def _on_click(self, x, y, button, pressed):
        if not pressed:
            return

        now = time.time()

        # Detect double click
        if now - self._last_click_time < self._double_click_threshold:
            if self.on_double_click_callback:
                self.on_double_click_callback(x, y, button)
        else:
            self.on_click_callback(x, y, button)

        self._last_click_time = now

    def start(self):
        """Start listening for mouse events."""
        self._listener = mouse.Listener(on_click=self._on_click)
        self._listener.start()
        return self._listener

    def stop(self):
        """Stop the mouse listener."""
        if self._listener:
            self._listener.stop()
