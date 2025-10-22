"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalKeys = GlobalKeys;
var react_1 = require("react");
var Platform = require("loot-core/shared/platform");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function GlobalKeys() {
    var navigate = (0, useNavigate_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        var handleKeys = function (e) {
            if (Platform.isBrowser) {
                return;
            }
            if (e.metaKey) {
                switch (e.key) {
                    case '1':
                        navigate('/budget');
                        break;
                    case '2':
                        navigate('/reports');
                        break;
                    case '3':
                        navigate('/accounts');
                        break;
                    case ',':
                        if (Platform.OS === 'mac') {
                            navigate('/settings');
                        }
                        break;
                    default:
                }
            }
        };
        document.addEventListener('keydown', handleKeys);
        return function () { return document.removeEventListener('keydown', handleKeys); };
    }, []);
    return null;
}
