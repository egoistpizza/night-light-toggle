# Night Light Toggle 🌙

![GNOME Shell](https://img.shields.io/badge/GNOME-40%2B-4a86cf?style=for-the-badge&logo=gnome&logoColor=white)
![License](https://img.shields.io/badge/License-GPLv3--only-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

A minimal, zero-config GNOME Shell extension designed to efficiently toggle the system's Night Light mode directly from the top panel. This eliminates the need to navigate through the complex settings menus.

---

<p align="center">
  <img src="https://github.com/egoistpizza/night-light-toggle/raw/gnome-40-44/assets/night-light-toggle-preview.gif" alt="Night Light Toggle Demo" width="600" style="border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
</p>

---

## ✨ Key Features

* **Optimal Performance:** Uses GSettings directly, ensuring instant response with zero latency.
* **One-Click Toggle:** Adds a symbolic icon to the panel for instant control.
* **Bi-directional Sync:** The indicator icon updates automatically if the Night Light setting is changed via schedule or another application.
* **Broad Compatibility:** Supports both Legacy and Modern GNOME Shell architectures.

## 📦 Compatibility & Branching Strategy

This project utilizes a multi-branch workflow to ensure stability across major GNOME architecture shifts (Legacy vs. ESM).

| GNOME Shell Version | Branch | Architecture | Supported Distributions |
| :--- | :--- | :--- | :--- |
| **45 - 49+** | [`main`](https://github.com/egoistpizza/night-light-toggle/tree/main) | ESM (Modern Modules) | **Ubuntu 23.10+, Debian Testing/Sid, Fedora 40+** |
| **40 - 44** | [`gnome-40-44`](https://github.com/egoistpizza/night-light-toggle/tree/gnome-40-44) | Legacy (Imports) | **Ubuntu 22.04 LTS, Debian 12 (Bookworm), Pop!\_OS 22.04** |

> **Note:** When installing from *extensions.gnome.org*, the system automatically delivers the correct version for your GNOME Shell.

## 🚀 Installation

### Method 1: GNOME Extensions Website (Recommended)
[**Download from extensions.gnome.org**](https://extensions.gnome.org/) *(Link will be finalized after approval)*

### Method 2: Manual Install (From Source)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/egoistpizza/night-light-toggle.git
    cd night-light-toggle
    ```

2.  **Checkout the correct branch for your system:**
    * For **Ubuntu 22.04 LTS / GNOME 42**:
        ```bash
        git checkout gnome-40-44
        ```
    * For **Ubuntu 23.10+ / GNOME 45+**:
        ```bash
        git checkout main
        ```

3.  **Install & Enable:**
    ```bash
    # 3a. Create the destination folder using the UUID
    mkdir -p ~/.local/share/gnome-shell/extensions/night-light-toggle@egoistpizza.github.com

    # 3b. Copy the files (Code, license, readme, assets)
    cp -r * ~/.local/share/gnome-shell/extensions/night-light-toggle@egoistpizza.github.com/

    # 3c. Reload GNOME Shell (Alt+F2 -> r, then Enter)
    # (Or log out and log back in)

    # 3d. Enable the extension
    gnome-extensions enable night-light-toggle@egoistpizza.github.com
    ```

## 🤝 Contributing

Contributions are welcome! Please follow the branching model:
* Target Pull Requests to **`main`** for GNOME 45+ features/fixes.
* Target Pull Requests to **`gnome-40-44`** for legacy support/fixes on older LTS systems.

## 📜 License

This project is licensed under the **GNU General Public License v3.0-only**.
