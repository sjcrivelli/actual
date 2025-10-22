"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenu = getMenu;
var electron_1 = require("electron");
function getMenu() {
    var template = [
        {
            label: 'File', // Kept purely for the keyboard shortcuts in Electron. Some shortcuts only work if they are in a menu (toggle devtools cannot be triggered in pure js).
            submenu: [
                {
                    label: 'Exit',
                    click: function (_item, focusedWindow) {
                        if (focusedWindow) {
                            var browserWindow = focusedWindow;
                            browserWindow.close();
                        }
                    },
                },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function (_item, focusedWindow) {
                        if (focusedWindow) {
                            var browserWindow = focusedWindow;
                            browserWindow.reload();
                        }
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click: function (_item, focusedWindow) {
                        if (focusedWindow) {
                            var browserWindow = focusedWindow;
                            browserWindow.webContents.toggleDevTools();
                        }
                    },
                },
                {
                    type: 'separator',
                },
                {
                    role: 'resetZoom',
                },
                {
                    role: 'zoomIn',
                },
                {
                    role: 'zoomOut',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'togglefullscreen',
                },
            ],
        },
    ];
    return electron_1.Menu.buildFromTemplate(template);
}
