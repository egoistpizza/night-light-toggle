/*
 * Night Light Toggle
 *
 * Copyright (C) 2025 egoistpizza
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

const { GObject, Gio, St } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const EXTENSION_SCHEMA_ID = 'org.gnome.shell.extensions.night-light-toggle';
const SYSTEM_SCHEMA_ID = 'org.gnome.settings-daemon.plugins.color';
const SETTING_KEY_NIGHT_LIGHT_ENABLED = 'night-light-enabled';

var NightLightToggleIndicator = GObject.registerClass(
    class NightLightToggleIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, 'Night Light Toggle');

            this._indicatorIcon = new St.Icon({
                icon_name: 'weather-clear-night-symbolic',
                style_class: 'system-status-icon',
            });
            this.add_child(this._indicatorIcon);

            this._settings = new Gio.Settings({ schema_id: SYSTEM_SCHEMA_ID });

            this.connect('button-press-event', () => this._toggleNightLight());

            this._settingsSignalId = this._settings.connect(
                `changed::${SETTING_KEY_NIGHT_LIGHT_ENABLED}`,
                () => this._updateIndicatorIcon()
            );

            this._updateIndicatorIcon();
        }

        _toggleNightLight() {
            let isEnabled = this._settings.get_boolean(SETTING_KEY_NIGHT_LIGHT_ENABLED);
            this._settings.set_boolean(SETTING_KEY_NIGHT_LIGHT_ENABLED, !isEnabled);
        }

        _updateIndicatorIcon() {
            let isEnabled = this._settings.get_boolean(SETTING_KEY_NIGHT_LIGHT_ENABLED);
            this._indicatorIcon.icon_name = isEnabled
                ? 'weather-clear-night-symbolic'
                : 'weather-clear-symbolic';
        }

        destroy() {
            if (this._settingsSignalId) {
                this._settings.disconnect(this._settingsSignalId);
                this._settingsSignalId = null;
            }
            super.destroy();
        }
    });

class Extension {
    constructor() {
        this._indicator = null;
        this._extensionSettings = null;
        this._settingsSignal = null;
        this._themeContext = null;
        this._cssFile = null;
        this._systemMenuItem = null;
        this._systemStatusItem = null;
        this._systemStatusSignal = null;
    }

    enable() {
        this._indicator = new NightLightToggleIndicator();
        Main.panel.addToStatusArea('night-light-toggle-indicator', this._indicator);

        this._extensionSettings = ExtensionUtils.getSettings(EXTENSION_SCHEMA_ID);

        this._themeContext = St.ThemeContext.get_for_stage(global.stage);
        this._cssFile = Me.dir.get_child('stylesheet.css');

        this._refreshSystemUI();

        this._settingsSignal = this._extensionSettings.connect('changed::hide-stock-toggle', () => {
            this._refreshSystemUI();
        });
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }

        this._removeStyles();
        this._restoreSystemUI();

        if (this._extensionSettings) {
            if (this._settingsSignal) {
                this._extensionSettings.disconnect(this._settingsSignal);
                this._settingsSignal = null;
            }
            this._extensionSettings = null;
        }
        this._themeContext = null;
        this._cssFile = null;
    }

    _refreshSystemUI() {
        let shouldHide = this._extensionSettings.get_boolean('hide-stock-toggle');

        this._locateSystemItems();

        if (shouldHide) {
            this._loadStyles();
            this._hideSystemItems();
        } else {
            this._removeStyles();
            this._restoreSystemUI();
        }
    }

    _locateSystemItems() {
        if (this._systemMenuItem && this._systemStatusItem) return;

        let aggregateMenu = Main.panel.statusArea.aggregateMenu;
        if (aggregateMenu && aggregateMenu._nightLight) {
            if (!this._systemMenuItem && aggregateMenu._nightLight.menu) {
                this._systemMenuItem = aggregateMenu._nightLight.menu.actor;
            }
            if (!this._systemStatusItem && aggregateMenu._nightLight.indicators) {
                this._systemStatusItem = aggregateMenu._nightLight.indicators;
            }
        }
    }

    _hideSystemItems() {
        if (this._systemMenuItem) {
            this._systemMenuItem.visible = false;
        }

        if (this._systemStatusItem) {
            this._systemStatusItem.visible = false;

            if (!this._systemStatusSignal) {
                this._systemStatusSignal = this._systemStatusItem.connect('notify::visible', () => {
                    let hidden = this._extensionSettings.get_boolean('hide-stock-toggle');
                    if (hidden && this._systemStatusItem.visible) {
                        this._systemStatusItem.visible = false;
                    }
                });
            }
        }
    }

    _restoreSystemUI() {
        if (this._systemMenuItem) {
            this._systemMenuItem.visible = true;
            this._systemMenuItem = null;
        }

        if (this._systemStatusItem) {
            if (this._systemStatusSignal) {
                this._systemStatusItem.disconnect(this._systemStatusSignal);
                this._systemStatusSignal = null;
            }

            this._systemStatusItem.visible = true;

            let aggregateMenu = Main.panel.statusArea.aggregateMenu;
            if (aggregateMenu && aggregateMenu._nightLight) {
                aggregateMenu._nightLight._sync();
            }
            this._systemStatusItem = null;
        }
    }

    _loadStyles() {
        if (this._themeContext && this._cssFile) {
            this._removeStyles();
            this._themeContext.get_theme().load_stylesheet(this._cssFile);
        }
    }

    _removeStyles() {
        if (this._themeContext && this._cssFile) {
            this._themeContext.get_theme().unload_stylesheet(this._cssFile);
        }
    }
}

function init() {
    return new Extension();
}