import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class NightLightPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 20,
            margin_top: 20,
            margin_bottom: 20,
            margin_start: 20,
            margin_end: 20
        });

        const row = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });

        const label = new Gtk.Label({
            label: "Hide System Night Light Menu Item",
            xalign: 0,
            hexpand: true
        });

        const toggle = new Gtk.Switch({
            active: settings.get_boolean('hide-stock-toggle'),
            valign: Gtk.Align.CENTER
        });

        toggle.connect('notify::active', (widget) => {
            settings.set_boolean('hide-stock-toggle', widget.active);
        });

        row.append(label);
        row.append(toggle);

        page.append(row);

        window.add(page);
    }
}