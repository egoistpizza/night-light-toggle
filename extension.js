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
    enable() {
        this._indicator = new NightLightToggleIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
