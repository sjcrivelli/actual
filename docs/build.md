# Build and Release Readiness

## Build Tools and Commands
- electron-builder, TypeScript, copyfiles, cross-env
- Build: `yarn build:dist && electron-builder`
- Watch: `yarn build:dist && cross-env ACTUAL_DOCUMENT_DIR="../../data" ACTUAL_DATA_DIR="../../data" electron .`

## Electron Config Summary
- Main entry: build/desktop-electron/index.js
- Preload: preload.ts
- Icons: icons/icon.icns (mac), icons/icon.ico (win)
- Protocols: app:// for asset loading
- afterSign hooks: beforePackHook.js

## Signing & Security Status
- HardenedRuntime (macOS), appx publisher (Windows)
- Notarization: @electron/notarize
- contextIsolation enabled, nodeIntegration disabled

## Cross-Platform Targets
- macOS (dmg), Windows (nsis, appx), Linux (AppImage, flatpak)
- Architectures: x64, arm64, ia32
