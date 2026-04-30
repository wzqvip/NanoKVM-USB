# NanoKVM-USB Project Structure

This document provides an overview of the NanoKVM-USB project structure, which consists of both a web-based client and a desktop client for controlling NanoKVM devices via USB.

## Root Directory

The root directory contains configuration files for deployment and project management.

- `browser/`: Source code for the web-based client.
- `desktop/`: Source code for the Electron-based desktop client.
- `Dockerfile`: Docker configuration for the web client.
- `docker-compose.yml`: Docker Compose configuration.
- `nginx.conf`: Nginx configuration for serving the web client.
- `README.md`: Project documentation.
- `LICENSE`: Apache 2.0 license file.

---

## Web Client (`browser/`)

A modern React application built with Vite.

- **Technology Stack**:
  - **Framework**: React 18
  - **Build Tool**: Vite
  - **UI Library**: Ant Design (`antd`)
  - **Styling**: Tailwind CSS
  - **State Management**: Jotai
  - **Icons**: Lucide React
  - **Internationalization**: i18next
- **Key Directories**:
  - `src/components/`: Reusable React components.
  - `src/libs/`: Core logic modules:
    - `device/`: Device connection and protocol handling.
    - `keyboard/`: Keyboard input simulation.
    - `mouse/`: Mouse input simulation.
    - `media/`: Media control functions.
    - `storage/`: Virtual storage management.
  - `src/jotai/`: Global state atoms.
  - `src/i18n/`: Translation files.

---

## Desktop Client (`desktop/`)

An Electron application providing native desktop integration.

- **Technology Stack**:
  - **Framework**: Electron + React
  - **Build Tool**: electron-vite
  - **UI/Styling**: Shared with the web client (Ant Design + Tailwind CSS).
  - **Device Communication**: `serialport` (Node.js library).
- **Structure**:
  - `src/main/`: Electron main process logic.
    - `device/`: Handles serial communication with the NanoKVM device.
    - `events/`: IPC event handlers.
  - `src/preload/`: Electron preload scripts for secure IPC.
  - `src/renderer/`: React-based UI (renderer process), mirroring the `browser` structure.
  - `src/common/`: Shared types and utilities between main and renderer processes.

---

## Deployment & Development

- **Web Client**: Can be built using `npm run build` and served via Nginx or deployed using the provided Docker configuration.
- **Desktop Client**: Can be built for Windows, macOS, and Linux using `electron-builder`.
  - Commands: `npm run build:win`, `npm run build:mac`, `npm run build:linux`.
- **Communication Protocol**: Both clients implement a serial-based protocol (`proto.ts`) to send HID commands (keyboard, mouse) and control signals to the NanoKVM hardware.
