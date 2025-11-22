const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {
}

function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.night-light-toggle');

    let frame = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 20,
        margin_top: 20,
        margin_bottom: 20,
        margin_start: 20,
        margin_end: 20
    });

    let row = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 20
    });

    let label = new Gtk.Label({
        label: "Hide System Night Light Menu Item",
        xalign: 0,
        hexpand: true
    });

    let toggle = new Gtk.Switch({
        active: settings.get_boolean('hide-stock-toggle'),
        valign: Gtk.Align.CENTER
    });

    toggle.connect('notify::active', (widget) => {
        settings.set_boolean('hide-stock-toggle', widget.active);
    });

    row.append(label);
    row.append(toggle);

    frame.append(row);

    return frame;
}