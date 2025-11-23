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
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import St from 'gi://St';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const SETTINGS_SCHEMA_ID = 'org.gnome.settings-daemon.plugins.color';
const SETTING_KEY_NIGHT_LIGHT_ENABLED = 'night-light-enabled';

const NightLightToggleIndicator = GObject.registerClass(
    class NightLightToggleIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, 'Night Light Toggle');

            this._indicatorIcon = new St.Icon({
                icon_name: 'weather-clear-night-symbolic',
                style_class: 'system-status-icon',
            });
            this.add_child(this._indicatorIcon);

            this._settings = new Gio.Settings({ schema_id: SETTINGS_SCHEMA_ID });

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

export default class NightLightExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._indicator = null;
        this._settings = null;
        this._settingsSignal = null;
        this._systemNightLightItem = null;
        this._systemSignal = null;
    }

    enable() {
        this._indicator = new NightLightToggleIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);

        this._settings = this.getSettings();

        this._refreshSystemUI();

        this._settingsSignal = this._settings.connect('changed::hide-stock-toggle', () => {
            this._refreshSystemUI();
        });
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }

        this._restoreSystemUI();

        if (this._settings) {
            if (this._settingsSignal) {
                this._settings.disconnect(this._settingsSignal);
                this._settingsSignal = null;
            }
            this._settings = null;
        }
    }

    _refreshSystemUI() {
        let shouldHide = this._settings.get_boolean('hide-stock-toggle');

        if (!this._systemNightLightItem) {
            if (Main.panel.statusArea.quickSettings) {
                this._systemNightLightItem = Main.panel.statusArea.quickSettings._nightLight;
            }
        }

        if (shouldHide) {
            this._hideSystemItems();
        } else {
            this._restoreSystemUI();
        }
    }

    _hideSystemItems() {
        if (this._systemNightLightItem) {
            this._systemNightLightItem.visible = false;

            if (!this._systemSignal) {
                this._systemSignal = this._systemNightLightItem.connect('notify::visible', () => {
                    let hidden = this._settings.get_boolean('hide-stock-toggle');
                    if (hidden && this._systemNightLightItem.visible) {
                        this._systemNightLightItem.visible = false;
                    }
                });
            }
        }
    }

    _restoreSystemUI() {
        if (this._systemNightLightItem) {
            if (this._systemSignal) {
                this._systemNightLightItem.disconnect(this._systemSignal);
                this._systemSignal = null;
            }
            this._systemNightLightItem.visible = true;
            this._systemNightLightItem = null;
        }
    }
}