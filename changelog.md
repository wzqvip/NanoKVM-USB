# Changelog

## [1.1.5] 2026-04-30

### Added
- **Immersive Mode**: A new full-screen mode for the desktop client that hides all floating UI elements (Menu, Virtual Keyboard) for a complete immersive experience.
- **Exit Shortcut**: Added `Ctrl+Alt+Esc` as a dedicated shortcut to exit immersive mode.
- **Settings Toggle**: Added a toggle switch in **Settings -> Appearance** to enable/disable Immersive Mode.
- **Internationalization**: Added support for Immersive Mode settings in English and Chinese.
- **Dummy Devices**: Added "Dummy Video Device (Testing)" and "Dummy USB Device (Testing)" at the top of selection lists for easier testing without physical hardware.
- **No-exit Mode**: Added a "No-exit Mode" setting that keeps the last captured frame on screen when the device is disconnected, instead of showing a black screen or error.
- **Menu Improvements**: Added an "Immersive Mode" toggle button directly to the floating menu bar for quick access.

### Improved
- **Keyboard Redirection**: Updated keyboard handling to allow the `Ctrl+Alt+Esc` shortcut to pass through even when keyboard redirection is active.
